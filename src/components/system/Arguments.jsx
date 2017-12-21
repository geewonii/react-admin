import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card} from 'antd'

class Arguments extends React.Component {
    constructor() {
        super()
        this.state = {
            userDetails: {
                Title: '',
                Content: '',
                IsMass: '1'
            }
        }
    }

    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="消息管理" second="群发消息" />
                <Row gutter={24}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{height: 600}}>
                                参数
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Arguments;