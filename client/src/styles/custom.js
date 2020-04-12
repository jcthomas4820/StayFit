import styled from 'styled-components';

// Different font styles 
export const Header1 = styled.div
`
    font-family: sans-serif;
    font-weight: bold;
    font-size: 30px;
    margin: 20px;
`;
export const Header2 = styled.div
`
    font-family: sans-serif;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
`;
export const Body = styled.div
`
    font-family: sans-serif;
    font-size: 15px;
`;
export const Error = styled.div
`
    font-family: sans-serif;
    font-size: 15px;
    color: red;
    font-weight: bold;
    margin-bottom: 5px;
`;

// Navigation bar
export const Nav = styled.div
`
    background-color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
    margin-bottom: 25px;
`;
export const NavHeader = styled.div
`
    max-width: 1010px;
    margin-left: 1rem;
    padding: 26px 20px;
    display: flex;
    align-items: center;
`;

// Links for the navigation bar 
export const Logo = styled.div
`
    margin-left: 1rem;
    padding-right: 1rem;
    text-align: left;
    font-family: sans-serif;
    font-weight: bold;
    text-decoration: none;

    a:focus, a:visited, a:link, a:active {
        text-decoration: none;
        color: black;
    }
    a:hover {
        color: grey;
    }
`;
export const CustomLink = styled.div
`
    margin-left: 1rem;
    padding-right: 1rem;
    text-align: left;
    font-family: sans-serif;

    a:focus, a:visited, a:link, a:active {
        text-decoration: none;
        color: grey;
    }
    a:hover {
        color: black;
    } 
`;

// Button, input box
export const Button = styled.button
`
    color: grey;
    font-size: 15px;
    margin: 5px;
    padding: 5px 15px;
    border: 3px solid #D3D3D3;
    border-radius: 3px;
    height: 35px;
    width: 230px;
`;
export const Input = styled.input
`
    padding: 5px;
    margin: 5px;
    border: 2px solid #D3D3D3;
    border-radius: 3px;
    width: 215px;
    height: 20px;
    background: #D3D3D3;
`;

// Popup menu 
export const PopupWrapper = styled.div
`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1050;
    display: flex;
    align-items: baseline;
`;

export const PopupSetup = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    width: ${props => props.width || "32%"}
    overflow:hidden;
    padding:16px;
    margin: 50px auto;
    box-sizing:border-box;
    z-index:1;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04);
    background:white;
    border: 0.5px solid #E8E8E8;
`;