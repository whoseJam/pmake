
let GLOBAL_CHILD_ID = 0;

export function Children(self) {
    return {
        node: self,

        children: {},
        
        // 获取子节点
        child: function(id) {
            return this.children[id];
        },

        forEach: function(callback) {
            let children = this.children;
            for (let id in children) callback(children[id]);
        },

        /**
         * - childName可省略
         * - child不可省略
         * - rule可省略
         */
        push: function() {
            let pos = 0;
            let rule = undefined;
            let id = undefined;
            let arg0 = arguments[0];
            if (typeof(arg0) === "number" ||
                typeof(arg0) === "string") id = arg0, pos++;
            else id = `child_${++GLOBAL_CHILD_ID}`;
            let child = arguments[pos++];
            if (child._.dirtyByMe) child.update();
            if (arguments[pos] !== undefined)
                rule = arguments[pos++];
            child.parent = this.node;
            this.children[id] = child;
            if (rule) child._.rule = rule;
            return id;
        },

        /**
         * 可以通过child引用删除
         * 
         * 也可以通过childName删除
         * 
         * 返回被删除的子节点
         */
        erase: function(child) {
            let children = this.children;
            if (typeof(child) === "object") {
                for (let id in children)
                    if (children[id] === child)
                        delete children[id];
                return child;
            }
            let childName = child;
            child = children[childName];
            delete children[childName];
            return child;
        },

        remove: function(child) {
            child = this.erase(child);
            if (child) child.remove();
        }, 

        dirty: function(target) {
            const children = this.children;
            for (let id in children) {
                const child = children[id];
                child.dirty(target);
            }
        },

        update() {
            const node = this.node;
            const children = this.children;
            for (let id in children) {
                const child = children[id];
                const rule = child._.rule;
                if (!rule) continue;
                const move = () => rule(this.node, child);
                if (child._.enter) {
                    child._.enter(child, move);
                    child._.enter = undefined;
                } else {
                    child.startAnimate(node);
                    move();
                }
            }
            for (let id in children) {
                const child = children[id];
                child.update();
            }
        }
    }
}