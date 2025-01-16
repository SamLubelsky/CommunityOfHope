import React, {useState} from 'react';
type Props = {
    onConfirm: () => void;
    children: React.ReactNode;
    className: string;
    confirmText: string;
}
export const ButtonWithConfirmation = ({ onConfirm, children, className, confirmText }: Props) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const handleClick = () => {
        setIsConfirming(false);
        onConfirm();
    }
    return (
        <>
        <a className={className} onClick={() => setIsConfirming(true)}>
            {children}
        </a>
        {isConfirming &&
        <div className="w-15 rounded-xl p-5 z-10 absolute left bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 bg-gray-300">
            <p className="font-primary font-7 text-red-500 text-5 mb-5 text-center">{confirmText}</p>
            <div className="flex flex-col justify-center gap-5">
            <button className="bg-cyan-400"onClick={handleClick}>Yes</button>
            <button className="bg-red-400" onClick={()=>setIsConfirming(false)}>No</button>
        </div>
        </div>
        }
        </>
    );
}