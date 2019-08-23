import React from 'react'
import './index.scss'
import PropTypes from 'prop-types'
import { Row, Col, Icon } from 'antd'

export default class TitleLine extends React.Component {
    static propTypes = {
      icon: PropTypes.string,
      iconColor: PropTypes.string,
      iconSize: PropTypes.string,
      title: PropTypes.string.isRequired,
      rightContent: PropTypes.any,
    };

    static defaultProps = {
      icon: '',
      iconColor: '#ed653f',
      iconSize: '16px',
    };

    render () {
      const { icon, title, iconSize, iconColor, rightContent } = this.props
      if (iconSize) {
        Object.assign(iconSize, { size: iconSize })
      }
      return (
        <Row>
          <Col>
            <div className='title-line'>
              <div className='left'>
                <Icon type={icon} theme='twoTone' twoToneColor={iconColor} style={{ fontSize: '16px' }} />{title}
              </div>
              {
                rightContent &&
                <div className='right'>{rightContent()}</div>
              }
            </div>
          </Col>
        </Row>
      )
    }
}
