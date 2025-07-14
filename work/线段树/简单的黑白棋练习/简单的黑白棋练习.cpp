#include<bits/stdc++.h>
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

int max(int a,int b,int c){
	return max(max(a,b),c);
}

struct Info{
	int tot;
	int len,llen,rlen;
	void init(int d){
		tot=1;
		if(d==1)len=llen=rlen=1;
		else len=llen=rlen=0;
	}
};
Info Merge(Info l,Info r){
	Info ans;
	ans.tot=l.tot+r.tot;
	if(l.tot==l.llen)ans.llen=l.llen+r.llen;
	else ans.llen=l.llen;
	if(r.tot==r.rlen)ans.rlen=r.rlen+l.rlen;
	else ans.rlen=r.rlen;
	ans.len=max(l.len,r.len,l.rlen+r.llen);
	return ans;
}

#define lc (x<<1)
#define rc (x<<1|1)
const int N=100005;
int n,m,a[N];

struct seg{
	int l,r;
	Info data;
}t[N*4];

void pushUp(int x){
	t[x].data=Merge(t[lc].data,t[rc].data);
}

void Build(int x,int l,int r){
	t[x].l=l;t[x].r=r;
	if(l==r){t[x].data.init(a[l]);return;}
	int mid=(l+r)>>1;
	Build(lc,l,mid);
	Build(rc,mid+1,r);
	pushUp(x);
}

Info Query(int x,int l,int r){
	if(l<=t[x].l&&t[x].r<=r)return t[x].data;
	int mid=(t[x].l+t[x].r)>>1;
	if(r<=mid)return Query(lc,l,r);
	if(l>mid)return Query(rc,l,r);
	return Merge(Query(lc,l,r),Query(rc,l,r));
}

void Update(int x,int pos){
	if(t[x].l==t[x].r){
		a[pos]^=1;
		t[x].data.init(a[pos]);
		return;
	}
	int mid=(t[x].l+t[x].r)>>1;
	if(pos<=mid)Update(lc,pos);
	else Update(rc,pos);
	pushUp(x);
} 

int main(){
	n=read();
	for(int i=1;i<=n;i++)a[i]=read();
	m=read();
	Build(1,1,n);
	for(int i=1,opt,x,y;i<=m;i++){
		opt=read();x=read();
		if(opt==0){
			y=read();
			cout<<Query(1,x,y).len<<'\n';
		}else{
			Update(1,x);
		}
	}
	return 0;
}

