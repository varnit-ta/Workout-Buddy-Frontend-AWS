import loading from '../assets/loading.gif'
import './styles/LoadingScreen.css'

const LoadingPage = () => {
    return (  
        <div className="loading-screen">
            <img src={loading} alt="" />
        </div>
    );
}
 
export default LoadingPage;