import type { ButtonHTMLAttributes } from 'react'

import './Button.css'

type ButtonVariant = 'primary' | 'secondary' | 'accent'

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    fullWidth?: boolean
}

function Button({
    variant = 'primary',
    fullWidth = false,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const classes = [
        'button',
        `button--${variant}`,
        fullWidth ? 'button--full-width' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    )
}

export default Button