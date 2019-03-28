import { Heading } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Component which will show information about the demonstration.
 */
class Introduction extends Component<any, any> {
    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                <Heading level={1}>Introduction</Heading>
                <p>Welcome to the P2P Grid PoC Demonstration.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor augue viverra ullamcorper fermentum.
                Ut malesuada lorem a pharetra dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id
                lectus massa. Duis ut enim tempor, lobortis sapien sed, facilisis dolor. Maecenas pellentesque sem quis lorem
                sagittis eleifend. Aliquam mattis eros sit amet magna interdum efficitur. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Quisque sodales felis nisl, ac cursus nibh vulputate ut. In fermentum turpis sed mauris aliquet
                pharetra. Nullam nibh lectus, pharetra sit amet mi eu, luctus convallis ligula. Curabitur et sem orci. Integer
                commodo fringilla dictum.</p>
                <p>To see the demonstration in action visit the <Link className="link" to="/grid">Grid</Link> page.</p>
            </React.Fragment >
        );
    }
}

export default Introduction;
