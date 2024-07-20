#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<queue>
#define GET getchar()
#define lc (x<<1)
#define rc (x<<1|1)
using namespace std;

inline int read(){
	int s=0,f=1;char t=GET;
	while('0'>t||t>'9'){if(t=='-')f=-1;t=GET;}
	while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=GET;}
	return s*f;
}

const int N=50005;
int n,m,Ans;

struct Info{
	int lsiz,rsiz,siz;
};

struct segmentTree{
	int l,r,set;
	Info d;
}t[N*4];

void pushSet(int x,int del){
	t[x].set=del;
	if(del==1){
		t[x].d.lsiz=0;
		t[x].d.rsiz=0;
		t[x].d.siz=0;
	}
	else{
		int SIZE=t[x].r-t[x].l+1;
		t[x].d.lsiz=SIZE;
		t[x].d.rsiz=SIZE;
		t[x].d.siz=SIZE;
	}
}

void pushDown(int x){
	if(t[x].set!=-1){
		pushSet(lc,t[x].set);
		pushSet(rc,t[x].set);
		t[x].set=-1;
	}
}

Info Merge(Info l,int lSIZE,Info r,int rSIZE){
	Info mid;
	if(l.lsiz==lSIZE)mid.lsiz=lSIZE+r.lsiz;
	else mid.lsiz=l.lsiz;
	if(r.rsiz==rSIZE)mid.rsiz=rSIZE+l.rsiz;
	else mid.rsiz=r.rsiz;
	mid.siz=max(max(l.siz,r.siz),l.rsiz+r.lsiz);
	return mid;
}

void buildTree(int l,int r,int x){
	t[x].set=-1;t[x].l=l;t[x].r=r;
	if(l==r){
		t[x].d.lsiz=t[x].d.rsiz=t[x].d.siz=1;
		return;
	}
	int mid=(l+r)>>1;
	buildTree(l,mid,lc);
	buildTree(mid+1,r,rc);
	t[x].d=Merge(t[lc].d,t[lc].r-t[lc].l+1,t[rc].d,t[rc].r-t[rc].l+1);
}

void SET(int x,int l,int r,int del){
	if(t[x].l>r||t[x].r<l)return;
	if(l<=t[x].l&&t[x].r<=r){
		pushSet(x,del);
		return;
	}
	pushDown(x);
	SET(lc,l,r,del);
	SET(rc,l,r,del);
	t[x].d=Merge(t[lc].d,t[lc].r-t[lc].l+1,t[rc].d,t[rc].r-t[rc].l+1);
}

void Ask(int x,int Num){
	pushDown(x);
	if(t[lc].d.siz>=Num){
		Ask(lc,Num);
	}
	else if(t[lc].d.rsiz+t[rc].d.lsiz>=Num){
		Ans=t[lc].r-t[lc].d.rsiz+1;
	}
	else if(t[rc].d.siz>=Num){
		Ask(rc,Num);
	}
}

int main(){
	n=read();m=read();
	buildTree(1,n,1);
	for(int i=1,opt,x,y;i<=m;i++){
		opt=read();
		if(opt==1){
			x=read();
			if(t[1].d.siz<x)printf("0\n");
			else{
				Ask(1,x);
				printf("%d\n",Ans);
				SET(1,Ans,Ans+x-1,1);
			}
		}
		if(opt==2){
			x=read();y=read();
			SET(1,x,x+y-1,0);
		}
	}
	return 0;
}
