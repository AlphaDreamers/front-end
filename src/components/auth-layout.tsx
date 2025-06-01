interface AuthLayoutProps {
    header: string;
    description: string;
    footer: React.ReactNode;
    children?: React.ReactNode;
}

const AuthLayout = ({header, description, footer, children} : AuthLayoutProps) => {
    return (
        <main className="max-w-md">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-primary">
                    {header} </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    {description}</p>
            </div>

            {children}

            <div className="mt-4 text-center text-xs text-muted-foreground max-w-3/4 mx-auto">
                {footer} </div>
        </main>
    );
};
export default AuthLayout;
