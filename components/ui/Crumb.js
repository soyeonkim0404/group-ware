/*
import {useEffect,useState} from "react";
import {Link, Typography} from "@mui/material";


const Crumb = ({ text: defaultText, textGenerator, href, last=false }) => {
    const [text, setText] = useState(defaultText);

    useEffect(async () => {
        if (!Boolean(textGenerator)) {
            console.log(textGenerator)
            return; }
        const finalText = await textGenerator();
        setText(finalText);
    }, [textGenerator]);

    if (last) {
        return <Typography color="text.primary">{text}</Typography>
    }

    return (
        <Link underline="hover" color="inherit" href={href}>
            {text}
        </Link>
    );
}

export default Crumb;*/
