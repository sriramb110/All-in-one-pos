import Lottie from 'react-lottie';
import * as animationData from '../assets/Animation_-_1729701186423.json'

function Loading() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return (
        <div className='modal'>
            <div className='bg-[#rgba(0, 0, 0, 0.2)] ' >
                <Lottie options={defaultOptions} isClickToPauseDisabled={true}/>
            </div>
        </div>
    )
}

export default Loading