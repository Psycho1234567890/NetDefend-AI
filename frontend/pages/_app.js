import '../styles/globals.css';
import Watermark from '../components/Watermark';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Watermark />
    </>
  );
}

export default MyApp;