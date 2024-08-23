import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import streamlit as st
from PIL import Image
import snowflake_manipulation as sfm
from datetime import datetime
import streamlit as st
from dotenv import load_dotenv
import os
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from htmlTemplates import css, bot_template, user_template
from langchain.prompts import SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate

pdf_path = "./Livre de l'interne - Médecine interne.pdf"

# Load environment variables
load_dotenv()

# Check if the API key is loaded correctly
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("API key is not set. Please ensure 'OPENAI_API_KEY' is in your .env file.")

# Define the prompt templates for medical diagnostics
general_system_template = r""" 
You are a medical assistant. Provide diagnostic suggestions based on the provided medical content.
If the question is not related to the context or symptoms mentioned in the provided documents, suggest related questions the user might ask and respond accordingly.
Ensure that the response is accurate and based on the content. Anything outside the context should be notified.
----
{context}
----
"""
general_user_template = "Symptom:```{question}```"
messages = [
    SystemMessagePromptTemplate.from_template(general_system_template),
    HumanMessagePromptTemplate.from_template(general_user_template)
]
qa_prompt = ChatPromptTemplate.from_messages(messages)

def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1500,
        chunk_overlap=200,
        length_function=len
    )
    return text_splitter.split_text(text)

def get_vectorstore(text_chunks):
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore

def get_conversation_chain(vectorstore):
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
    return ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory,
        combine_docs_chain_kwargs={'prompt': qa_prompt}
    )

def handle_userinput(user_question, chat_container):
    if st.session_state.conversation is None:
        st.error(":red[Please process the documents first.]")
        return
    response = st.session_state.conversation({'question': user_question})
    st.session_state.chat_history = response['chat_history']

    for i, message in enumerate(st.session_state.chat_history):
        if i % 2 == 0:
            chat_container.markdown(user_template.replace("{{MSG}}", message.content), unsafe_allow_html=True)
        else:
            chat_container.markdown(bot_template.replace("{{MSG}}", message.content), unsafe_allow_html=True)
# Process the PDF only if it hasn't been processed yet
if "conversation" not in st.session_state:
    def process_pdf(pdf_path):
        try:
            with st.spinner(":red[Processing file]"):
                raw_text = ""
                raw_text += get_pdf_text([pdf_path])
                text_chunks = get_text_chunks(raw_text)
                vectorstore = get_vectorstore(text_chunks)
                st.session_state.conversation = get_conversation_chain(vectorstore)
                st.success("Processing complete!")
        except FileNotFoundError:
            st.error("The specified PDF file was not found. Please check the path.")

    process_pdf(pdf_path)


# Initialize session state variables
def reset_session_state():
    st.session_state['want_appointment'] = False
    st.session_state['disease_predicted'] = False
    st.session_state['predicted_disease'] = ""

if 'want_appointment' not in st.session_state:
    reset_session_state()

# Download nltk resources
nltk.download('punkt')
nltk.download('stopwords')

# Load the dataset
data = pd.read_csv('data/Symptom2Disease.csv') 
data.drop(columns=["Unnamed: 0"], inplace=True)

def load_disease_descriptions():
    descriptions_df = pd.read_csv('data/Disease_Descriptions.csv')
    return descriptions_df.set_index('Disease')['Description'].to_dict()

disease_descriptions = load_disease_descriptions()

def load_disease_precaution():
    precaution_df = pd.read_csv('data/Disease_Precautions_Advice.csv')
    return precaution_df.set_index('Disease')['Precaution'].to_dict()

disease_precautions = load_disease_precaution()

# Extracting 'label' and 'text' columns from the 'data' DataFrame
labels = data['label']  
symptoms = data['text'] 

# Text Preprocessing
stop_words = set(stopwords.words('english'))

# Text Preprocessing Function
def preprocess_text(text):
    words = word_tokenize(text.lower())
    words = [word for word in words if word.isalpha() and word not in stop_words]
    return ' '.join(words)

# Apply preprocessing to symptoms
preprocessed_symptoms = symptoms.apply(preprocess_text)

# Feature Extraction using TF-IDF
tfidf_vectorizer = TfidfVectorizer(max_features=1500) 
tfidf_features = tfidf_vectorizer.fit_transform(preprocessed_symptoms).toarray()

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(tfidf_features, labels, test_size=0.2, random_state=42)

# KNN Model Training
knn_classifier = KNeighborsClassifier(n_neighbors=5) 
knn_classifier.fit(X_train, y_train)


def main():
    st.write(css, unsafe_allow_html=True)
    choice = st.sidebar.selectbox('Choisir une option', ('Chatbox', 'Prediction maladie'))
    
    if choice == 'Chatbox':
        if "conversation" not in st.session_state:
            st.session_state.conversation = None
        if "chat_history" not in st.session_state:
            st.session_state.chat_history = []

        st.header(":blue[Medical Diagnostic Assistant]") 
        chat_container = st.container()
        user_question = st.text_input(":orange[Describe your symptoms:]", key="user_input")

        if user_question:
            handle_userinput(user_question, chat_container)
        st.sidebar.markdown('[Back home](http://127.0.0.1:8000/patient/profil)')
    elif choice== 'Prediction maladie':
        
        # Header
        st.title('🔍 MediCareTeccart Assistance au Diagnostique')
        st.markdown("Bienvenue dans le Vérificateur de Symptômes de Maladie MediCareTeccart. Veuillez entrer vos symptômes dans la boîte de texte ci-dessous et cliquez sur 'Prédire' pour voir la maladie possible.")

        # Sidebar - Optional for additional features or information
        st.sidebar.header("A propos")
        st.sidebar.info("Cette application est conçue pour aider à prédire les maladies en fonction des symptômes saisis par l'utilisateur. Elle utilise des algorithmes d'apprentissage automatique pour analyser les symptômes et fournir un diagnostic possible. Il s'agit toujours d'une prédiction et non d'un résultat final. Vous pourriez avoir besoin de tests supplémentaires avec un spécialiste.")

        # Main content
        col1, col2 = st.columns(2)

        with col1:
            st.header("Entrez vos symptomes")
            user_input = st.text_area("", height=150)

        with col2:
            st.header("Diagnostique Possible ")
            predict_button = st.button('Predict Disease')
            
            if predict_button or st.session_state['disease_predicted']:
                st.session_state['disease_predicted'] = True
                
                if user_input == "":
                    st.info('Entez vos symptomes')
                else:    
                    if predict_button:
                        preprocessed_input = preprocess_text(user_input)
                        input_vectorized = tfidf_vectorizer.transform([preprocessed_input])
                        predicted_disease = knn_classifier.predict(input_vectorized)
                        st.session_state['predicted_disease'] = predicted_disease[0]
                        
                    st.success(f'En fonction de vos symptomes, il est probable que vous ayez: {st.session_state["predicted_disease"]}')
                    
                    if st.session_state["predicted_disease"] in disease_descriptions and st.session_state["predicted_disease"] in disease_precautions:
                        st.subheader('Description of the disease : ')
                        st.info(disease_descriptions[st.session_state["predicted_disease"]])
                        st.subheader('Precaution and Advice')
                        st.info(disease_precautions[st.session_state["predicted_disease"]])
                    else:
                        st.error("Pas de descriptions ou de conseils pour cette maladie.")
                    
                    st.success("Prompt Rétablissement! 🌟")
                    
                    if st.button("Retour"):
                        reset_session_state()
                        st.experimental_rerun()
            
            else:
                st.write("La prédiction de votre diagnostique apparaîtra ici.")                
            
        # Footer
        st.markdown("---")
        st.markdown("© 2024 Disease Symptom Checker. By MediCareTeccart. All Rights Reserved.")
if __name__ == '__main__':
    main()
