#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

namespace FastIO{
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=100005;
const int M=200005;
int n,m;

struct seg{
	int lc,rc,fa,dep;
}t[M*30];
int rt[M],tot;

void build(int& x,int l,int r){
	x=++tot;
	if(l==r){t[x].fa=l;t[x].dep=1;return;}
	int mid=(l+r)>>1;
	build(t[x].lc,l,mid);
	build(t[x].rc,mid+1,r);
}

void setFa(int& x,int last,int l,int r,int p,int f){
	t[x=++tot]=t[last];
	if(l==r){t[x].fa=f;return;}
	int mid=(l+r)>>1;
	if(p<=mid)setFa(t[x].lc,t[last].lc,l,mid,p,f);
	else setFa(t[x].rc,t[last].rc,mid+1,r,p,f);
}

void addDep(int& x,int last,int l,int r,int p){
	t[x=++tot]=t[last];
	if(l==r){t[x].dep++;return;}
	int mid=(l+r)>>1;
	if(p<=mid)addDep(t[x].lc,t[last].lc,l,mid,p);
	else addDep(t[x].rc,t[last].rc,mid+1,r,p);
}

int getFa(int x,int l,int r,int p){
	if(l==r)return t[x].fa;
	int mid=(l+r)>>1;
	if(p<=mid)return getFa(t[x].lc,l,mid,p);
	return getFa(t[x].rc,mid+1,r,p);
}

int getDep(int x,int l,int r,int p){
	if(l==r)return t[x].dep;
	int mid=(l+r)>>1;
	if(p<=mid)return getDep(t[x].lc,l,mid,p);
	return getDep(t[x].rc,mid+1,r,p);
}

int getFa(int cur,int x){
	int fa=getFa(cur,1,n,x);
	if(x==fa)return x;
	return getFa(cur,fa);
}

void Merge(int& cur,int last,int x,int y){
	int fx=getFa(last,x);
	int fy=getFa(last,y);
	if(fx!=fy){
		int dx=getDep(last,1,n,fx);
		int dy=getDep(last,1,n,fy);
		if(dx>dy)swap(fx,fy),swap(dx,dy),swap(x,y);
		// dx<=dy
		// fa[fx]=fy
		setFa(cur,last,1,n,fx,fy);
		if(dx==dy) // dep[fy]=max(dep[fy],dep[fx]+1)
			addDep(cur,cur,1,n,fy); 
	}else cur=last;
}

int main(){
	n=read();m=read();
	build(rt[0],1,n);
	for(int i=1,opt;i<=m;i++){
		opt=read();
		if(opt==1){
			int a=read(),b=read();
			Merge(rt[i],rt[i-1],a,b);
		}else if(opt==2){
			int k=read();
			rt[i]=rt[k];
		}else{
			int a=read(),b=read();
			if(getFa(rt[i-1],a)==getFa(rt[i-1],b)){
				printf("1\n");
			}else printf("0\n");
			rt[i]=rt[i-1];
		}
	}
	return 0;
}

