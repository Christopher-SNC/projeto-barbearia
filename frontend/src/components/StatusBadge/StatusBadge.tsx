import type { ReactNode } from 'react'

import './StatusBadge.css'

type StatusBadgeVariant =
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'no-show'
    | 'active'
    | 'inactive'

interface StatusBadgeProps {
    children: ReactNode
    variant?: StatusBadgeVariant
}

function StatusBadge({
    children,
    variant = 'confirmed',
}: StatusBadgeProps) {
    return (
        <span
            className={`status-badge status-badge--${variant}`}
        >
            {children}
        </span>
    )
}

export default StatusBadge