#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

const int N=10000005;
const int inf=0x3f3f3f3f;
int ch[N][2],fa[N],val[N],siz[N],num[N];
int cnt,rt,n;

void visitVal(int x){
	if(ch[x][0])visitVal(ch[x][0]);
	if(val[x]!=inf&&val[x]!=-inf)cout<<val[x]<<" ";
	else cout<<"# ";
	if(ch[x][1])visitVal(ch[x][1]);
}

void visitNum(int x){
	if(ch[x][0])visitNum(ch[x][0]);
	cout<<num[x]<<" ";
	if(ch[x][1])visitNum(ch[x][1]);
}

void pushUp(int x){
	siz[x]=siz[ch[x][0]]+siz[ch[x][1]]+num[x];
}

void rotate(int x,int &f){
	int y=fa[x],z=fa[y],L=(ch[y][0]!=x),R=(L^1);
	if(y==f)f=x;else if(ch[z][0]==y)ch[z][0]=x;else ch[z][1]=x;
	fa[x]=z;fa[y]=x;fa[ch[x][R]]=y;
	ch[y][L]=ch[x][R];ch[x][R]=y;
	pushUp(y);pushUp(x);
}

void Splay(int x,int &f){
	while(x!=f){
		int y=fa[x],z=fa[y];
		if(y!=f){
			if((ch[y][0]==x)^(ch[z][0]==y))rotate(x,f);
			else rotate(y,f);
		}
		rotate(x,f);
	}
}

void init(){
	fa[2]=1;ch[1][1]=2;
	val[1]=-inf;val[2]=inf;
	num[1]=1;num[2]=1;
	siz[1]=2;siz[2]=1;
	rt=1;cnt=2;
}

int findPrev(){
	int x=ch[rt][0];
	while(ch[x][1])x=ch[x][1];
	return x;
}

int findNext(){
	int x=ch[rt][1];
	while(ch[x][0])x=ch[x][0];
	return x;
}

int find(int x,int v){
	if(!x)return 0;
	if(val[x]>v)return find(ch[x][0],v);
	else if(val[x]<v)return find(ch[x][1],v);
	return x;
}

int findGE(int x,int v){
	if(!x)return 0;
	if(val[x]<v)return findGE(ch[x][1],v);
	else if(val[x]>v){
		int tmp=findGE(ch[x][0],v);
		if(!tmp)return x;
		return tmp;
	}
	return x;
}

int findLT(int x,int v){
	if(!x)return 0;
	if(val[x]>=v)return findLT(ch[x][0],v);
	int tmp=findLT(ch[x][1],v);
	if(!tmp)return x;
	return tmp;
}

int findGT(int x,int v){
	if(!x)return 0;
	if(val[x]<=v)return findGT(ch[x][1],v);
	int tmp=findGT(ch[x][0],v);
	if(!tmp)return x;
	return tmp;
}

int findKth(int x,int k){
	if(!x)return 0;
	if(siz[ch[x][0]]+num[x]>=k&&siz[ch[x][0]]<k)return x;
	else if(siz[ch[x][0]]>=k)return findKth(ch[x][0],k);
	else return findKth(ch[x][1],k-siz[ch[x][0]]-num[x]);
}

int insert(int& x,int f,int v){
	if(!x){x=++cnt;num[x]++;val[x]=v;fa[x]=f;return x;}
	if(val[x]>v)return insert(ch[x][0],x,v);
	else if(val[x]<v)return insert(ch[x][1],x,v);
	num[x]++;
	return x;
}

void insert(int v){
	int x=insert(rt,0,v);
	Splay(x,rt);
}

void erase(int v){
	int x=find(rt,v);
	if(!x)return;
	num[x]--;
	if(num[x]==0){
		Splay(x,rt);
		int prev=findPrev();
		int next=findNext();
		Splay(prev,rt);
		Splay(next,ch[rt][1]);
		fa[x]=0;ch[next][0]=0;
		pushUp(next);pushUp(prev);
	}else Splay(x,rt);
}

int getRank(int v){
	int x=findGE(rt,v);
	Splay(x,rt);
	return siz[ch[rt][0]];
}

int findKth(int k){
	int x=findKth(rt,k);
	return val[x];
}

int findPrev(int v){
	int x=findLT(rt,v);
	Splay(x,rt);
	return val[x];
}

int findNext(int v){
	int x=findGT(rt,v);
	Splay(x,rt);
	return val[x];
}

int main(){
	int opt,x;
	init();
	scanf("%d",&n);
	for(int i=1;i<=n;i++){
		scanf("%d%d",&opt,&x);
		if(opt==1)insert(x);
		if(opt==2)erase(x);
		if(opt==3)printf("%d\n",getRank(x));
		if(opt==4)printf("%d\n",findKth(x+1));
		if(opt==5)printf("%d\n",findPrev(x));
		if(opt==6)printf("%d\n",findNext(x));
	}
	return 0;
}
