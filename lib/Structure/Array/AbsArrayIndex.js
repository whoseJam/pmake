import { Text } from "../Basic/Text";

export function AbsArrayIndex(self) {
    self.indexed = indexed;
    self.indexAlign = indexAlign;

    self.listen("onInsert", function() {
        update.call(this);
    }, self);

    self.listen("onErase", function() {
        update.call(this);
    }, self);

    return self;
}

function update() {
    if (!this._.indexed) return;
    let self = this;
    function indexRule(parent, child) {
        child[self._.indexChildXLocator](
            parent[self._.indexParentXLocator]() +
            self._.indexXMargin
        );
        child[self._.indexChildYLocator](
            parent[self._.indexParentYLocator]() + 
            self._.indexYMargin
        );
    }
    if (this._.indexed) {
        let elems = this._.elements;
        for (let i = 0; i < elems.length; i++) {
            let elem = elems[i];
            let idx = elem.children.child("index");
            if (!idx) {
                idx = Text(this, i + this._.start);
                elem.children.push("index", idx, indexRule);
            } else {
                if (+idx.text() !== i + this._.start) idx.text(i + this._.start);
                idx.rule = indexRule;
                idx.rule(elem, idx);
            }
        }
    }
}

function indexAlign(align, margin = 5) {
    margin = Math.abs(margin);
    if (align === "bottom") {
        this._.indexParentXLocator = "cx";
        this._.indexChildXLocator = "cx";
        this._.indexXMargin = 0;
        this._.indexParentYLocator = "my";
        this._.indexChildYLocator = "y";
        this._.indexYMargin = margin;
    } else if (align === "left") {
        this._.indexParentXLocator = "x";
        this._.indexChildXLocator = "mx";
        this._.indexXMargin = -margin;
        this._.indexParentYLocator = "cy";
        this._.indexChildYLocator = "cy";
        this._.indexYMargin = 0;
    } else if (align === "top") {
        this._.indexParentXLocator = "cx";
        this._.indexChildXLocator = "cx";
        this._.indexXMargin = 0;
        this._.indexParentYLocator = "y";
        this._.indexChildYLocator = "my";
        this._.indexYMargin = -margin;
    } else throw new Error("invalid arguments align = " + align);
    update.call(this);
    return this;
}

function indexed(indexed) {
    if (typeof(indexed) === "string") {
        this.indexAlign(indexed);
        indexed = true;
    }
    this._.indexed = indexed;
    if (indexed) {
        update.call(this);
    } else {
        for (let i = 0; i < elems.length; i++) {
            let idx = elem.children.child("index");
            idx.opacity(0).remove();
        }
    }
    return this;
}
