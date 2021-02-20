import React from 'react';
import './Navbar.scss';
import { Navbar as Nav, NavItem, Icon, NavbarAlignment } from 'react-materialize';

const options = {
    draggable: true,
    edge: "left" as NavbarAlignment
}

interface NavbarProps {
    exec: any, uploadCode: any
}

function Navbar(props: NavbarProps) {
    return (
        <Nav
            alignLinks="right"
            brand={<a href="#">Simple Addition Calculator</a>}
            menuIcon={<Icon>menu</Icon>}
            options={options}
            className="Navbar"
        >
            <NavItem href="#" onClick={props.exec}>
                <Icon>refresh</Icon>
            </NavItem>
            <NavItem href="#">
                <input type="file" onChange={props.uploadCode} id="file_upload" />
                <label htmlFor="file_upload"><Icon>cloud_upload</Icon></label>
            </NavItem>
        </Nav>
    );
}

export default Navbar;
