#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;
int n,m,prt[8005];

struct line
{
	int u,v,val;
}l[500005];

int getP(int k)
{
	if(prt[k]==k)return k;
	prt[k]=getP(prt[k]);
	return prt[k];
}

bool cmp(line a,line b)
{
	return a.val<b.val;
}

int main()
{
	cin>>n>>m;
	int x,y;
	for(int i=1;i<=n;i++)prt[i]=i;
	for(int i=1;i<=m;i++)
	{
		cin>>l[i].u>>l[i].v>>l[i].val;
	}
	sort(l+1,l+1+m,cmp);
	int p1,p2,num=0,ans=0;
	for(int i=1;i<=m;i++)
	{
		p1=getP(l[i].u),p2=getP(l[i].v);
		if(p1!=p2)
		{
			prt[p1]=p2;
			num++;
			ans=max(ans,l[i].val);
			if(num==n-1)break;
		}
	}
	cout<<n-1<<" "<<ans;
	return 0;
}
