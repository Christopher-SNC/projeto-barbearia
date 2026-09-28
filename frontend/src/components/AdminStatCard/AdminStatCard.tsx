import type { ReactNode } from 'react'

import './AdminStatCard.css'

interface AdminStatCardProps {
    label: string
    value: ReactNode
    hint?: string
}

function AdminStatCard({
    label,
    value,
    hint,
}: AdminStatCardProps) {
    return (
        <article className="admin-stat-card">
            <span className="admin-stat-card__label">
                {label}
            </span>

            <strong className="admin-stat-card__value">
                {value}
            </strong>

            {hint && (
                <span className="admin-stat-card__hint">
                    {hint}
                </span>
            )}
        </article>
    )
}

export default AdminStatCard