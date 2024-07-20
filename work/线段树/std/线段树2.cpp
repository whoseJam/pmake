#include<bits/stdc++.h>
using namespace std;
#define lc (x<<1)
#define rc (x<<1|1) 
typedef long long ll; 

ll read(){
	ll s=0,f=1;char t=getchar();
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

const ll N=100005;
ll n,q,m;

struct seg{
	ll sum,l,r,add,mul;
}t[N*4];

void pushAdd(ll x,ll d){
	t[x].add=(t[x].add+d)%m;
	t[x].sum=(t[x].sum+d*(t[x].r-t[x].l+1))%m;
}

void pushMul(ll x,ll d){
	t[x].mul=t[x].mul*d%m;
	t[x].add=t[x].add*d%m;
	t[x].sum=t[x].sum*d%m;
}

void pushUp(ll x){
	t[x].sum=(t[lc].sum+t[rc].sum)%m;
}

void pushDown(ll x){
	if(t[x].mul!=1){
		pushMul(lc,t[x].mul);
		pushMul(rc,t[x].mul);
		t[x].mul=1;
	}
	if(t[x].add){
		pushAdd(lc,t[x].add);
		pushAdd(rc,t[x].add);
		t[x].add=0;
	}
}

void Build(ll x,ll l,ll r){
	t[x].l=l;t[x].r=r;t[x].mul=1;
	if(l==r){t[x].sum=read();return;}
	ll mid=(l+r)>>1;
	Build(lc,l,mid);
	Build(rc,mid+1,r);
	pushUp(x);
}

void Add(ll x,ll l,ll r,ll d){
	if(l<=t[x].l&&t[x].r<=r){
		pushAdd(x,d);
		return;
	}
	ll mid=(t[x].l+t[x].r)>>1;
	pushDown(x);
	if(l<=mid)Add(lc,l,r,d);
	if(r>mid)Add(rc,l,r,d);
	pushUp(x);
}

void Mul(ll x,ll l,ll r,ll d){
	if(l<=t[x].l&&t[x].r<=r){
		pushMul(x,d);
		return;
	}
	ll mid=(t[x].l+t[x].r)>>1;
	pushDown(x);
	if(l<=mid)Mul(lc,l,r,d);
	if(r>mid)Mul(rc,l,r,d);
	pushUp(x);
}

ll Query(ll x,ll l,ll r){
	if(l<=t[x].l&&t[x].r<=r)
		return t[x].sum;
	ll mid=(t[x].l+t[x].r)>>1;
	pushDown(x);
	if(r<=mid)return Query(lc,l,r);
	if(l>mid)return Query(rc,l,r);
	return (Query(lc,l,r)+Query(rc,l,r))%m;
}

int main(){
	n=read();q=read();m=read();
	Build(1,1,n);
	for(ll i=1,opt,x,y;i<=q;i++){
		opt=read();x=read();y=read();
		if(opt==1)Mul(1,x,y,read());
		else if(opt==2)Add(1,x,y,read());
		else cout<<Query(1,x,y)<<'\n';
	}
	return 0;
}

