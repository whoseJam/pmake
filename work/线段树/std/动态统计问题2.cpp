#include<vector>
#include<cstdio>
#include<cstring>
#include<iostream>
#include<algorithm>
#define LL long long
#define lc (x<<1)
#define rc (x<<1|1)
 
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=100005;
int a[N],n,m;

struct seg{
	int l,r,mn,add;
}t[N*4];

void pushAdd(int x,int d){
	t[x].add+=d;
	t[x].mn+=d;
}

void pushDown(int x){
	if(t[x].add){
		pushAdd(lc,t[x].add);
		pushAdd(rc,t[x].add);
		t[x].add=0;
	}
}

void pushUp(int x){
	t[x].mn=min(t[lc].mn,t[rc].mn);
}

void Build(int x,int l,int r){
	t[x].l=l;t[x].r=r;
	if(l==r){t[x].mn=a[l];return;}
	int mid=(l+r)>>1;
	Build(lc,l,mid);
	Build(rc,mid+1,r);
	pushUp(x);
}

void Add(int x,int l,int r,int d){
	if(l<=t[x].l&&t[x].r<=r){pushAdd(x,d);return;}
	int mid=(t[x].l+t[x].r)>>1;
	pushDown(x);
	if(l<=mid)Add(lc,l,r,d);
	if(r>mid)Add(rc,l,r,d);
	pushUp(x);
}

int Query(int x,int l,int r){
	if(l<=t[x].l&&t[x].r<=r)return t[x].mn;
	int mid=(t[x].l+t[x].r)>>1;
	pushDown(x);
	if(r<=mid)return Query(lc,l,r);
	else if(l>mid)return Query(rc,l,r);
	return min(Query(lc,l,r),Query(rc,l,r));
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++)a[i]=read();
	Build(1,1,n);
	for(int i=1;i<=m;i++){
		char opt[3];scanf("%s",opt);
		if(opt[0]=='A'){
			int l=read(),r=read(),d=read();
			Add(1,l,r,d);
		}else {
			int l=read();
			int r=read();
			cout<<Query(1,l,r)<<endl;
		}
	}
}
