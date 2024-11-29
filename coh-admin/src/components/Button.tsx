type Props = {
    label:string;
}
export default function Button({label}: Props){
    return (
        <button className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
            {label}
        </button>
    );
}