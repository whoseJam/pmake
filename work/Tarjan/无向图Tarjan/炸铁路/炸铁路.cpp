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

const int N=155;
const int M=5005;
const int inf=0x3f3f3f3f;
int prt[N],low[N],dfn[N],tot;
int n,m;

struct line{
	int Nxt,to;
}l[M*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;
	l[++cnt]=(line){h[v],u};h[v]=cnt;
}

typedef pair<int,int> pa;
vector<pa> ans;

void Tarjan(int u){
	low[u]=dfn[u]=++tot;
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(prt[u]==v)continue;
		if(dfn[v]==0){
			prt[v]=u;
			Tarjan(v);
			low[u]=min(low[u],low[v]);
			if(low[v]>=dfn[v]){
				ans.push_back(make_pair(min(u,v),max(u,v)));
			}
		}else low[u]=min(low[u],dfn[v]);
	}
} 

int main(){
	n=read();m=read();
	for(int i=1,a,b;i<=m;i++){
		a=read();b=read();
		Link(a,b);
	}
	Tarjan(1);
	sort(ans.begin(),ans.end());
	for(int i=0;i<ans.size();i++)
		cout<<ans[i].first<<' '<<ans[i].second<<'\n';
	return 0;
}

