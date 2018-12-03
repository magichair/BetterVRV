/*global chrome*/
import React, { Component } from 'react';

import ControlPanel from "./ControlPanel";
import ControlRow from "./ControlRow";
import KeyBindRow from "./KeyBindRow";

import './styles/Options.css';

const INDEV = true;

class Options extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "hideDescriptions": true,
            "hideThumbnails": true,
            "showWatchedThumbnails": false,

            "majorSeekIncrement": 10,
            "minorSeekIncrement": 5,

            "majorSeekForward": ["16+76", ""],
            "majorSeekBackward": ["16+74", ""],
            "minorSeekForward": ["39", "76"],
            "minorSeekBackward": ["37", "74"],
            "playPause": ["75", "32"],
            "pause": ["80", ""],
            "toggleFullscreen": ["70", ""],
        };

        this.load();
    }

    load() {
        if (!INDEV) {
            chrome.storage.sync.get(
                this.state,
                (response) => this.setState(response)
            );
        }
    }

    save(newState) {
        this.setState(
            {minorSeekIncrement: newState},
            () => {
                if (!INDEV) {
                    chrome.storage.sync.set(
                        this.state,
                        () => {if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);}
                    );
                }
            }
        )
    }

    render() {
        return (
            <div>

                <div id="header">
                    <img id="logo" src="../images/logotype.png" />
                </div>

                <div id="container">

                    <div className="section-title">Settings</div>

                    <ControlPanel title="Spoilers">
                            <ControlRow title="Hide Thumbnails"
                                description="All thumbnails will be blurred. The placeholder image used by the player while loading the episode will also be blurred."
                                controlType="toggle"
                                value={this.state.hideThumbnails}
                                onChange={
                                    (newValue) => this.setState(
                                        {hideThumbnails: newValue},
                                        () => {if (!INDEV) this.save();})
                                }
                            />
                            <ControlRow title="Show Watched Thumbnails"
                                description="Thumbnails on episodes you've already watched will not be blurred."
                                controlType="toggle"
                                value={this.state.showWatchedThumbnails}
                                disabled={!this.state.hideThumbnails}
                                subrow={true}
                                onChange={
                                    (newValue) => this.setState(
                                        {showWatchedThumbnails: newValue},
                                        () => {if (!INDEV) this.save();}
                                    )
                                }
                            />
                            <ControlRow title="Hide Descriptions"
                                description="All episode descriptions will be hidden."
                                controlType="toggle"
                                value={this.state.hideDescriptions}
                                onChange={
                                    (newValue) => this.setState(
                                        {hideDescriptions: newValue},
                                        () => {if (!INDEV) this.save();}
                                    )
                                }
                            />
                    </ControlPanel>

                    <ControlPanel title="Tuning">
                        <ControlRow title="Major Seek Increment"
                            description="How far forward/backward the major seek shortcuts will skip."
                            controlType="number"
                            value={this.state.majorSeekIncrement}
                            onChange={
                                (newValue) => this.setState(
                                    {majorSeekIncrement: newValue},
                                    () => {if (!INDEV) this.save();}
                                )
                            }
                        />
                        <ControlRow title="Minor Seek Increment"
                            description="How far forward/backward the minor seek shortcuts will skip."
                            controlType="number"
                            value={this.state.minorSeekIncrement}
                            onChange={
                                (newValue) => this.setState(
                                    {minorSeekIncrement: newValue},
                                    () => {if (!INDEV) this.save();}
                                )
                            }
                        />
                    </ControlPanel>

                    <ControlPanel title="Key Bindings">
                        <KeyBindRow
                            title="Toggle Fullscreen"
                            value={this.state.toggleFullscreen}
                            onChange={console.log}
                        />
                        <KeyBindRow
                            title="Toggle Play/Pause"
                            value={this.state.playPause}
                            onChange={console.log}
                        />
                        <KeyBindRow
                            title="Seek Forward - Major"
                            value={this.state.majorSeekForward}
                            onChange={console.log}
                        />
                        <KeyBindRow
                            title="Seek Forward - Minor"
                            value={this.state.minorSeekForward}
                            subrow={true}
                            onChange={console.log}
                        />
                        <KeyBindRow
                            title="Seek Backward - Major"
                            value={this.state.majorSeekBackward}
                            onChange={console.log}
                        />
                        <KeyBindRow
                            title="Seek Backward - Minor"
                            value={this.state.minorSeekBackward}
                            subrow={true}
                            onChange={console.log}
                        />
                    </ControlPanel>

                    <div id="reset-container">
                        <div id="reset-button">
                            reset all settings to defaults
                        </div>
                    </div>

                </div>

                <div id="footer">
                    <div className="footer-entry">
                        Issues? Suggestions? Complaints? <a href="mailto:tuckerchapin@gmail.com">Let me know.</a>
                    </div>
                    <div className="footer-entry">
                        <a href="https://github.com/tuckerchapin/BetterVRV/issues">Github.</a>
                    </div>
                    <div className="footer-entry">
                        Consider <a href="https://venmo.com/tuckerchapin">donating.</a>
                    </div>
                    <div id="disclaimer">
                        VRV, CrunchyRoll, and all other trademarks, service marks, trade names, product names and logos appearing on this site are the property of their respective owners.
                    </div>
                </div>

            </div>
        );
    }
}

export default Options;
