import * as sd from "@/sd";

/**
 * 构建失配树
 * @param {sd.BaseTree} ac
 * @param {{
*  OnLink: (u: sd.SDNode, v: sd.SDNode, sourceId: number, targetId: number) => void,
*  OnFocusParent: (parent: number) => void,
*  OnRemoveFocusParent: (parent: number) => void,
*  OnFocusChild: (child: number) => void,
*  OnRemoveFocusChild: (child: number) => void,
*  OnFailJumpTo: (fail: number, parent: number) => void,
*  OnFirstFailJumpTo: (fail: number, parent: number) => void
* }} args
*/
export async function BuildFailTree(ac, args, skipAll = false) {
   const OnLink = args.OnLink;
   const OnFocusParent = args.OnFocusParent;
   const OnRemoveFocusParent = args.OnRemoveFocusParent;
   const OnFocusChild = args.OnFocusChild;
   const OnRemoveFocusChild = args.OnRemoveFocusChild;
   const OnFailJumpTo = args.OnFailJumpTo;
   const OnFirstFailJumpTo = args.OnFirstFailJumpTo;
   const Q = [1];
   
   while (Q.length > 0) {
       const u = Q[0]; Q.shift();
       
       if (OnFocusParent) {
           if (!skipAll) await sd.pause();
           await OnFocusParent(u);
       }
       const children = ac.children(u);

       for (let i = 0; i < children.length; i++) {
           const v = ac.nodeId(children[i]); Q.push(v);

           if (OnFocusChild) {
               if (!skipAll) await sd.pause();
               await OnFocusChild(v);
           }
           const character = ac.value(u, v).text();
           
           let f = ac.element(u).fail;
           let first = true;
           while (f && !ac.element(f).acch[character]) {
               if (first && OnFirstFailJumpTo) {
                   if (!skipAll) await sd.pause();
                   await OnFirstFailJumpTo(f, u);
                   await OnFailJumpTo(f, u);
                   first = false;
               } else if (OnFailJumpTo) {
                   if (!skipAll) await sd.pause();
                   await OnFailJumpTo(f, u);
               }

               f = ac.element(f).fail;
           }

           if (f && ac.element(f).acch[character]) {
               if (first && OnFirstFailJumpTo) {
                   if (!skipAll) await sd.pause();
                   await OnFirstFailJumpTo(f, u);
                   await OnFailJumpTo(f, u);
                   first = false;
               } else if (OnFailJumpTo) {
                   if (!skipAll) await sd.pause();
                   await OnFailJumpTo(f, u);
               }

               const failOfV = ac.element(f).acch[character];
               if (OnLink) {
                   if (!skipAll) await sd.pause();
                   OnLink(ac.element(v), ac.element(failOfV), +v, +failOfV);
               }
               ac.element(v).fail = failOfV;
           } else {
               if (OnLink) {
                   if (!skipAll) await sd.pause();
                   OnLink(ac.element(v), ac.element(1), +v, 1);
               }
               ac.element(v).fail = 1;
           }

           if (OnRemoveFocusChild) {
               if (!skipAll) await sd.pause();
               await OnRemoveFocusChild(v);
           }
       }

       if (OnRemoveFocusParent) {
           if (!skipAll) await sd.pause();
           await OnRemoveFocusParent(u);
       }
   }
}