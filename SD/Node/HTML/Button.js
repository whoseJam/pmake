import { BaseHTML } from "./BaseHTML";

export function Button(parent) {
    BaseHTML.call(this, parent);

    this.member.new("onClick", undefined);
    
    this.dom(
        <div>
            <button
                style={{
                    width: "90%",
                    height: "90%",
                    top: "50%",
                    left: "50%",
                }}
                onClick={() => {
                    const callback = this.member.get("onClick");
                    if (callback) {
                        callback.call(this);
                    }
                }}
                >
                点击
            </button>
        </div>
    );

    this.width(60).height(25);

    return this;
}

Button.prototype = {
    ...BaseHTML.prototype
};

Button.prototype.onClick = function(callback) {
    this.member.setAndFlush("onClick", callback);
    return this;
}