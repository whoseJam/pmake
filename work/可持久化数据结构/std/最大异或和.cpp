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

const int N=600005;
int a[N],sum[N],tot;
int n,m;

struct trie{
	int siz,ch[2];
}t[N*30];
int rt[N];

void insert(int& x,int last,int v,int k){
	t[x=++tot]=t[last];t[x].siz++;
	if(k==-1)return;
	int dir=(v>>k)&1;
	insert(t[x].ch[dir],t[last].ch[dir],v,k-1);
}

int nodeSize(int xl,int xr){
	return t[xr].siz-t[xl].siz;
}

int query(int xl,int xr,int v,int k){
	if(k==-1)return 0;
	int dir=(v>>k)&1;
	if(nodeSize(t[xl].ch[dir^1],t[xr].ch[dir^1])==0)
		return query(t[xl].ch[dir],t[xr].ch[dir],v,k-1);
	return query(t[xl].ch[dir^1],t[xr].ch[dir^1],v,k-1)+(1<<k);
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++){
		a[i]=read();
		sum[i]=sum[i-1]^a[i];
	}
	insert(rt[0],0,sum[0],30);
	for(int i=1;i<=n;i++)
		insert(rt[i],rt[i-1],sum[i],30);
	
	char opt[3];
	for(int i=1;i<=m;i++){
		scanf("%s",opt);
		if(opt[0]=='A'){
			a[++n]=read();
			sum[n]=sum[n-1]^a[n];
			insert(rt[n],rt[n-1],sum[n],30);
		}else{
			int l=read(),r=read(),x=read();
			int tmp=sum[n]^x;
			cout<<query(rt[l-2],rt[r-1],tmp,30)<<'\n';
		}
	}
	return 0;
}

