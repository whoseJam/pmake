#include<bits/stdc++.h>
#define lc (x<<1)
#define rc (x<<1|1)
using namespace std;
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

const ll Mod=10007;
const ll N=100005;
ll n,m;

struct Info{
	ll sm1,sm2,sm3,len;
	void init(ll x){sm1=x;sm2=x*x;sm3=x*x*x;len=1;} 
	void output(){
		cout<<"sm1="<<sm1<<" sm2="<<sm2<<" sm3="<<sm3<<" len="<<len<<"\n";
	}
};

Info Merge(Info a,Info b){
	Info ans;
	ans.sm1=(a.sm1+b.sm1)%Mod;
	ans.sm2=(a.sm2+b.sm2)%Mod;
	ans.sm3=(a.sm3+b.sm3)%Mod;
	ans.len=a.len+b.len;
	return ans;
}

Info pushAdd(Info a,ll d){
	ll lst1=a.sm1,lst2=a.sm2;
	a.sm1=(a.sm1+d*a.len)%Mod;
	a.sm2=(a.sm2+2*lst1*d+d*d*a.len)%Mod;
	a.sm3=(a.sm3+3*lst2*d+3*lst1*d*d+d*d*d*a.len)%Mod;
	return a;
}

Info pushSet(Info a,ll d){
	a.sm1=d*a.len%Mod;
	a.sm2=d*d*a.len%Mod;
	a.sm3=d*d*d*a.len%Mod;
	return a;
}

Info pushMul(Info a,ll d){
	a.sm1=a.sm1*d%Mod;
	a.sm2=a.sm2*d*d%Mod;
	a.sm3=a.sm3*d*d*d%Mod;
	return a;
}

struct seg{
	ll l,r,add,mul,set;
	Info sum;
}t[N*4];
// e = SET(e,set)*mul+add

void pushUp(ll x){
	t[x].sum=Merge(t[lc].sum,t[rc].sum);
}

void pushAdd(ll x,ll d){
	t[x].sum=pushAdd(t[x].sum,d);
	t[x].add=(t[x].add+d)%Mod;
}

void pushSet(ll x,ll d){
	t[x].sum=pushSet(t[x].sum,d);
	t[x].set=d;
	t[x].mul=1;
	t[x].add=0;
}

void pushMul(ll x,ll d){
	t[x].sum=pushMul(t[x].sum,d);
	t[x].mul=t[x].mul*d%Mod;
	t[x].add=t[x].add*d%Mod;
}

void pushDown(ll x){
	if(t[x].set!=-1){
		pushSet(lc,t[x].set);
		pushSet(rc,t[x].set);
		t[x].set=-1;
	}
	if(t[x].mul!=1){
		pushMul(lc,t[x].mul);
		pushMul(rc,t[x].mul);
		t[x].mul=1;
	}
	if(t[x].add!=0){
		pushAdd(lc,t[x].add);
		pushAdd(rc,t[x].add);
		t[x].add=0;
	}
}

void Build(ll x,ll l,ll r){
	t[x].l=l;t[x].r=r;
	t[x].mul=1;t[x].add=0;t[x].set=-1;
	if(l==r){t[x].sum.init(0);return;}
	ll mid=(l+r)>>1;
	Build(lc,l,mid);
	Build(rc,mid+1,r);
	pushUp(x);
}

void Add(ll x,ll l,ll r,ll d){
	if(l<=t[x].l&&t[x].r<=r){pushAdd(x,d);return;}
	ll mid=(t[x].l+t[x].r)>>1;
	pushDown(x);
	if(l<=mid)Add(lc,l,r,d);
	if(r>mid)Add(rc,l,r,d);
	pushUp(x); 
}

void Mul(ll x,ll l,ll r,ll d){
	if(l<=t[x].l&&t[x].r<=r){pushMul(x,d);return;}
	ll mid=(t[x].l+t[x].r)>>1;
	pushDown(x);
	if(l<=mid)Mul(lc,l,r,d);
	if(r>mid)Mul(rc,l,r,d);
	pushUp(x); 
}

void Set(ll x,ll l,ll r,ll d){
	if(l<=t[x].l&&t[x].r<=r){pushSet(x,d);return;}
	ll mid=(t[x].l+t[x].r)>>1;
	pushDown(x);
	if(l<=mid)Set(lc,l,r,d);
	if(r>mid)Set(rc,l,r,d);
	pushUp(x);
}

Info Query(ll x,ll l,ll r){
	if(l<=t[x].l&&t[x].r<=r)return t[x].sum;
	ll mid=(t[x].l+t[x].r)>>1;
	pushDown(x);
	if(r<=mid)return Query(lc,l,r);
	if(l>mid)return Query(rc,l,r);
	return Merge(Query(lc,l,r),Query(rc,l,r));
}

int main(){
	n=read();m=read();
	Build(1,1,n);
	for(ll i=1,x,a,b,c;i<=m;i++){
		x=read();a=read();b=read();c=read();
		if(x==1)Add(1,a,b,c);
		else if(x==2)Mul(1,a,b,c);
		else if(x==3)Set(1,a,b,c);
		else{
			Info sum=Query(1,a,b);
			if(c==1)cout<<sum.sm1<<'\n';
			else if(c==2)cout<<sum.sm2<<'\n';
			else cout<<sum.sm3<<'\n';
		}
	}
	return 0;
}

