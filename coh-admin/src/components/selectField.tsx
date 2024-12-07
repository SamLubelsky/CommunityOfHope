import React from 'react';
type Props = {
    fieldName: string;
    options: string[];
    displayName: string;
    required: boolean;
}
export default function SelectField({fieldName, options, displayName, required}: Props){
    const optionsList = options.map((option, index) => {
        return <option key={index}>{option}</option>
    });
    return (
        <div>
        <label
          htmlFor={fieldName}
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          {displayName}
        </label>
          <select
            required={required}
            name={fieldName}
            id={fieldName}
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6'
          >
            {optionsList}
          </select>

      </div>
    );
}