import XHeader from "./MainComponents/XHeader";
import WriteBox from "./MainComponents/WriteBox";
import RecommendList from "@/pages/Main/MainComponents/RecommendList";
import * as S from "@/pages/Main/MainStyled";
import NewQuote from "@/pages/Main/MainComponents/NewQuote";
import { useState } from "react";

export default function MainWrite() {
    const [newQuoteActive, setNewQuoteActive] = useState(false);
    const [recommendActive, setRecommendActive] = useState(false);

    return (
        <S.Container>
            <XHeader />

            <WriteBox
                onComplete={() => setNewQuoteActive(true)}  
                onAI={() => setRecommendActive(true)}        
            />

            {recommendActive && (
                <RecommendList 
                    onSelectComplete={() => {
                        setNewQuoteActive(true);   
                        setRecommendActive(false); 
                    }}
                />
            )}
        
            {newQuoteActive && <NewQuote />}
        </S.Container>
    );
}
