type Props = {
    error: string;
}
export function ErrorScreen({error}: Props){
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-red-500">Oops! Something went wrong</h1>
            <p className="text-lg text-gray-500">Error: {error}</p>
            <p className="text-lg text-gray-500">We're sorry, but we're having some technical difficulties. Please try again later.</p>
        </div>
    );
}