import React, {createElement, ComponentType} from 'react';
type IconProps = {
    className?: string;
}
type Props ={
    fieldName: string;
    fieldType?: string;
    required?: boolean;
    displayName?: string;
    placeholder?: string;
    defaultValue?: string;
    value?: string;
    IconComponent?: ComponentType<IconProps>;
}
export default function InputField({fieldName, fieldType, required, displayName, IconComponent, placeholder=displayName, defaultValue, value}: Props){
    return (
        <div>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
                {displayName}
            </label>
            {IconComponent && <IconComponent className="inline pointer-events-none h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />}
            <input
                value={value}
                defaultValue={defaultValue}
                id={fieldName}
                name={fieldName}
                type={fieldType}
                required={required}
                placeholder={placeholder}
                className="bg-white w-11/12 mx-1 px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring 
    focus:ring-cyan-500 focus:border-cyan-500 text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 
    disabled:shadow-none text-gray-700"
            />
        </div>
    );
}