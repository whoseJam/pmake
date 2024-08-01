#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
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

const ll MAXN=1000005;
ll n,F2[MAXN],F3[MAXN],F4[MAXN],F5[MAXN];
ll ans;

struct TArray{
	ll C[MAXN];
	ll lowbit(ll x){
		return x&(-x);
	}
	void Insert(ll pos,ll d){
		for(ll i=pos;i<=MAXN-5;i+=lowbit(i))
			C[i]=C[i]+d;
	}
	ll Sum(ll pos){
		ll sum=0;
		for(ll i=pos;i>0;i-=lowbit(i))sum=sum+C[i];
		return sum;
	}
};
TArray t1,t2,t3,t4;

int main(){
	n=read();
	for(ll i=1,x;i<=n;i++){
		x=read();
		F2[i]=t1.Sum(x-1);
		F3[i]=t2.Sum(x-1);
		F4[i]=t3.Sum(x-1);
		F5[i]=t4.Sum(x-1);
		t1.Insert(x,1);
		t2.Insert(x,F2[i]);
		t3.Insert(x,F3[i]);
		t4.Insert(x,F4[i]);
		ans+=F5[i];
	}
	cout<<ans<<'\n';
	return 0;
}
