
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
            else id = `child${++GLOBAL_CHILD_ID}`;
            let child = arguments[pos++];
            if (arguments[pos] !== undefined)
                rule = arguments[pos++];
            child.parent = this;
            this.children[id] = child;
            if (rule) {
                child.rule = rule;
                rule(this.node, child);
            }
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

        update() {
            let children = this.children;
            for (let id in children) {
                let child = children[id];
                let rule = child.rule;
                if (typeof(rule) === "function")
                    rule(this.node, child);
                child.update();
            }
        }
    }
}