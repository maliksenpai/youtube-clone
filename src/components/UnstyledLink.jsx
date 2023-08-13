import { Link } from 'react-router-dom';

export function UnStyledLink(children) {
    return (
        <Link to={children.to} style={{ color: 'inherit', textDecoration: 'inherit' }}>
            {children.children}
        </Link>
    );
}
