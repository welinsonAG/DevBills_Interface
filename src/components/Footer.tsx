


const Footer = () => {
    const currentyear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 border-t border-gray-700 py-4">
            <div className="container-app">
                <p className="text-sm text-gray-400 text-center">DevBills {currentyear} - Desenvolvido por <strong>Welinson Gomes</strong> {''}com <strong>TypeScript & <strong>React</strong></strong></p>
            </div>
        </footer>
    );
};

export default Footer;