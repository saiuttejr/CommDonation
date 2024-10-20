import { useRouteError } from "react-router-dom"
export const Error = ()=>{
    const error = useRouteError();
    return(
        <div>
            <h1>OOPS ! Something Went Wrong ...</h1>
           <h2> {error.status}: {error.statusText};</h2>  
        </div>
    )

}
