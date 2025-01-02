import {ComponentType, useState} from 'react';
type IconProps = {
    className?: string;
}
type Props ={
    fieldName: string;
    required?: boolean;
    displayName: string;
    defaultValue?: string;
    IconComponent?: ComponentType<IconProps>;
}
export default function ImageField({fieldName, required, displayName, defaultValue, IconComponent}: Props){
    const [preview, setPreview] = useState<string | null>(null);
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>){
        if(!event.target.files){
            return;
        }
        const selectedFile = event.target.files[0];
        if(!selectedFile){
            return;
        }
        setPreview(URL.createObjectURL(selectedFile));
    }
    return (
        <div>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
                {displayName}
            </label>
            {IconComponent && <IconComponent className="inline pointer-events-none h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />}
            <input
                defaultValue={defaultValue}
                id={fieldName}
                name={fieldName}
                type="file"
                accept="image/*"
                required={required}
                onChange={handleFileChange}
                className="bg-white w-11/12 mx-1 px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring 
    focus:ring-cyan-500 focus:border-cyan-500 text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 
    disabled:shadow-none text-gray-700"
            />
            {preview && <img src={preview} alt="Preview" className="w-20 h-20 mt-2" />}
        </div>
    );
}