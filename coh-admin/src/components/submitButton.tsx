import { ComponentType } from "react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

type Props = { 
    isLoading: boolean;
    label: string;
}
export default function SubmitButton({isLoading, label}: Props){
    return (
    <div className="flex">
    <button
        disabled={isLoading}
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-cyan-400 border border-transparent rounded-md shadow-sm hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
        {isLoading ? 'Logging In...' : label} <ArrowRightIcon className="inline-block ml-auto h-5 w-5 text-gray-50" />
    </button>
    </div>
    );
}