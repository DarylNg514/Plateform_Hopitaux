import './Navbar.css'

const Navbar = () => {
    return (
        <header className="header">
            <a href="#" className="logo">
                <ion-icon name="cafe"></ion-icon>
                <span>DICC</span>
            </a>
            <nav className="nav">
                <a href="#">Home</a>
                <a href="#">About</a>
                <a href="#">Menu</a>
                <a href="#">Reviews</a>
                <a href="#">Contact</a>
            </nav>
        </header>
    )
}

export default Navbar;