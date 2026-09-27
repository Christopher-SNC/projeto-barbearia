import type { InputHTMLAttributes } from 'react'

import './DateInput.css'

interface DateInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    fullWidth?: boolean
}

function DateInput({
    label,
    fullWidth = false,
    className = '',
    id,
    ...props
}: DateInputProps) {
    const classes = [
        'date-input',
        fullWidth ? 'date-input--full-width' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={classes}>
            {label && (
                <label className="date-input__label" htmlFor={id}>
                    {label}
                </label>
            )}

            <input
                className="date-input__field"
                id={id}
                type="date"
                {...props}
            />
        </div>
    )
}

export default DateInput