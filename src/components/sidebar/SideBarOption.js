import React , {Component} from 'react'
import PropTypes from 'prop-types'

export  class SideBarOption extends Component {
    static propTypes ={
        name:PropTypes.string.isRequired,
        lastMessage: PropTypes.string,
        active: PropTypes.bool,
        onClick:PropTypes.func
    }
    static defaultProps = {
        lastMessage:"",
        active: false,
        onClick: () => {}

    }

    render() {
        const { name, lastMessage , active , onClick } = this.props
        var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return (
            <div
               
                className={`user ${active ? 'active': ''}`}
                onClick={ onClick }
            >
                <div className="user-photo">{name[0].toUpperCase()}</div>
                <div className="user-info">
                    <div className="name">{name}</div>
                    {lastMessage && <div className="last-message">{base64regex.test(lastMessage.split(',')[1])?"Image":lastMessage}</div>}
                </div>

            </div>
        )
    }
}