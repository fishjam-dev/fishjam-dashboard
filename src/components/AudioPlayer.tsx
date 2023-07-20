import { FaMicrophone } from "react-icons/fa"

type AudioProps = {
    stream: MediaStream | null;
};

export const AudioPlayer = ({ 
    stream,
}: AudioProps) => {
    return (
        <div className='flex flex-row flex-wrap justify-between items-center bg-gray-200 w-min h-min p-3 rounded-md'>
            <audio autoPlay={true} ref={(ref) => ref ? (ref.srcObject = stream) : null} />
            <FaMicrophone size="50"/>
        </div>

    );
};
