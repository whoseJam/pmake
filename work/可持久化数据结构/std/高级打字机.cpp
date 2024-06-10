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
int n;

struct seg{
	int lc,rc;
	char v;
}t[N*30];
int rt[N],len[N],tot;

void Insert(int& x,int last,int l,int r,int pos,char val){
	t[x=++tot]=t[last];
	if(l==r){t[x].v=val;return;}
	int mid=(l+r)>>1;
	if(pos<=mid)Insert(t[x].lc,t[last].lc,l,mid,pos,val);
	else Insert(t[x].rc,t[last].rc,mid+1,r,pos,val);
}

char Query(int x,int l,int r,int pos){
	if(l==r)return t[x].v;
	int mid=(l+r)>>1;
	if(pos<=mid)return Query(t[x].lc,l,mid,pos);
	return Query(t[x].rc,mid+1,r,pos);
}

void Dfs(int x,int l,int r){
	if(!x)return;
	if(l==r)cout<<t[x].v;
	int mid=(l+r)>>1;
	Dfs(t[x].lc,l,mid);
	Dfs(t[x].rc,mid+1,r); 
}

int main(){
	n=read();char opt[3];
	
	int version=0;
	for(int i=1;i<=n;i++){
		scanf("%s",opt);
		if(opt[0]=='T'){
			version++;
			len[version]=len[version-1]+1;
			char val[3];
			scanf("%s",val);
			Insert(rt[version],rt[version-1],1,n,len[version],val[0]);
		}else if(opt[0]=='U'){
			int x=read();
			version++;
			rt[version]=rt[version-x-1];
			len[version]=len[version-x-1];
		}else{
			cout<<Query(rt[version],1,n,read())<<'\n';
		}
	}
	return 0;
}

