export function formatEmail(emailText: string): { name: string, email: string } {
    let name: string = "";
    let email: string = "";

    const fullFormat = /^"([^"]*)"\s*<([^>]+)>$/;
    const emailOnlyFormat = /^[^\s<>]+$/;

    if (fullFormat.test(emailText)) {
        const match = emailText.match(fullFormat);
        if (match) {
            name = match[1];
            email = match[2];
        }
    } else if (emailOnlyFormat.test(emailText)) {
        name = emailText.split("@")[0];
        email = emailText;
    } else {
        email = emailText;
    }
    return { name, email: email.toLocaleLowerCase() };
}