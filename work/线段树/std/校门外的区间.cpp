#include<bits/stdc++.h>
#define lc (x<<1)
#define rc (x<<1|1)
using namespace std;
// 1  2  3  4  5  6  7  8
// P0 E0 P1 E1 P2 E2 P3 E3...
int P(int x){
	return (x+1)*2-1;
}

int E(int x){
	return (x+1)*2;
}

int Lp,Rp;
void read(){
	char s,t,c;
	int l,r;
	cin>>s>>l>>c>>r>>t;
	if(s=='(')Lp=E(l);
	else Lp=P(l);
	if(t==')')Rp=E(r-1);
	else Rp=P(r);
}

const int N=70000*2+10;
int flg[N];

struct seg{
	int l,r,rev,set;
	int query(){
		int ans=0;
		if(set!=-1)ans=set;
		ans^=rev;
		return ans;
	}
}t[N*4];

void pushSet(int x,int d){
	t[x].set=d;
	t[x].rev=0;
}

void pushRev(int x,int d){
	t[x].rev^=d;
}

void pushDown(int x){
	if(t[x].set!=-1){
		pushSet(lc,t[x].set);
		pushSet(rc,t[x].set);
		t[x].set=-1;
	}
	if(t[x].rev){
		pushRev(lc,t[x].rev);
		pushRev(rc,t[x].rev);
		t[x].rev=0;
	}
}

void Build(int x,int l,int r){
	t[x].l=l;t[x].r=r;
	if(l==r)return;
	int mid=(l+r)>>1;
	Build(lc,l,mid);
	Build(rc,mid+1,r);
}

void Set(int x,int l,int r,int d){
	if(l<=t[x].l&&t[x].r<=r){pushSet(x,d);return;}
	pushDown(x);
	int mid=(t[x].l+t[x].r)>>1;
	if(l<=mid)Set(lc,l,r,d);
	if(r>mid)Set(rc,l,r,d);
}

void Rev(int x,int l,int r,int d){
	if(l<=t[x].l&&t[x].r<=r){pushRev(x,d);return;}
	pushDown(x);
	int mid=(t[x].l+t[x].r)>>1;
	if(l<=mid)Rev(lc,l,r,d);
	if(r>mid)Rev(rc,l,r,d);
}

int Ask(int x,int pos){
	if(t[x].l==t[x].r)return t[x].query();
	int mid=(t[x].l+t[x].r)>>1;
	pushDown(x);
	if(pos<=mid)return Ask(lc,pos);
	return Ask(rc,pos);
}

void Dfs(int x){
	if(t[x].l==t[x].r){
		flg[t[x].l]=t[x].query();
		return;
	}
	pushDown(x);
	Dfs(lc);
	Dfs(rc);
}

int main(){
	char opt;
	Build(1,P(0),P(70000));
	
	int n=P(70000);
	while(cin>>opt){
		read();
		if(opt=='U'){
			Set(1,Lp,Rp,1);
		}
		if(opt=='I'){
			if(1<Lp)Set(1,1,Lp-1,0);
			if(Rp<n)Set(1,Rp+1,n,0);
		}
		if(opt=='D'){
			Set(1,Lp,Rp,0);
		}
		if(opt=='C'){
			if(1<Lp)Set(1,1,Lp-1,0);
			if(Rp<n)Set(1,Rp+1,n,0);
			Rev(1,Lp,Rp,1);
		}
		if(opt=='S'){
			Rev(1,Lp,Rp,1);
		}
	}
	Dfs(1);int empt=true;
	for(int i=P(0),j;i<=P(70000);i++){
		if(flg[i]==1){
			j=i;
			while(j+1<=P(70000)&&flg[j])j++;
			// i -> j
			if(i%2==1)cout<<"[";else cout<<"(";
			cout<<((i-1)/2)<<",";
			cout<<((j-1)/2);
			if(j%2==0)cout<<"]";else cout<<")";
			cout<<" ";
			empt=false;
			i=j;
		}
	} 
	if(empt)cout<<"empty set\n";
	return 0;
}

