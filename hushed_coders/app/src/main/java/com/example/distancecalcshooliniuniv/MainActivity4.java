package com.example.distancecalcshooliniuniv;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity4 extends AppCompatActivity {


    MainActivity5 obj = new MainActivity5();
    public int  var12= obj.flag_block;
    static int f;
    public static int[][] cost=
            {
                    {0,250,400,999,999,999,999,999},
                    {250,0,100,100,999,999,999,999},
                    {400,100,0,999,999,999,999,999},
                    {999,100,999,0,200,100,300,999},
                    {999,999,999,200,0,100,100,999},
                    {999,999,999,100,100,0,200,999},
                    {999,999,999,300,100,200,0,70},
                    {999,999,999,999,999,999,70,999}
            };
//    int r=0;
//    Intent q= getIntent();
//    int a=q.getIntExtra("val_1",r);
//    int b=q.getIntExtra("val_2",r);





    int vertex=8;


    int[] parent= new int[100];
    int[] dist = new int[100];
    boolean[] visited = new boolean[vertex];

    int src1;
    TextView t;
    TextView t2;
    TextView u;


    int src2;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main4);
        t=findViewById(R.id.textView6);
        t2=findViewById(R.id.textView13);
        t2.setText(" ");
        int r=0;






        int f1=0;
        int f2=0;
        int f3=0;
        int f4=0;
        int f5=0;
        int f6=0;
        int f7=0;
        int f8=0;
        int f9=0;
        int fp=0;
        Intent i = getIntent();
        int a_block2= i.getIntExtra("a",f1);
        int srca=i.getIntExtra("src_a",f2);
        int agri_block2=i.getIntExtra("b",f3);
        int srcb =i.getIntExtra("src_b",f2);
        int c_block2=i.getIntExtra("c",f4);
        int srcc=i.getIntExtra("src_c",f2);
        int d_e_block2=i.getIntExtra("d",f5);
        int srcd=i.getIntExtra("src_d",f2);
        int g_h_block_2=i.getIntExtra("e",f6);
        int srce=i.getIntExtra("src_e",f2);
        int lib2=i.getIntExtra("f",f7);
        int srcf=i.getIntExtra("src_f",f2);
        int ai_block2=i.getIntExtra("g",f8);
        int srcg=i.getIntExtra("src_g",f2);
        int oat2=i.getIntExtra("h",f9);
        int srch=i.getIntExtra("src_h",f2);
        if(a_block2!=0){
            src2=a_block2;
        }
        if(agri_block2!=0){
            src2=agri_block2;
        }
        if(c_block2!=0){
            src2=c_block2;
        }
        if(d_e_block2!=0){
            src2=d_e_block2;

        }
        if(g_h_block_2!=0){
            src2=g_h_block_2;
        }
        if(lib2!=0){
            src2=lib2;
        }
        if(ai_block2!=0){
            src2=ai_block2;
        }
        if(oat2!=0){
            src2=oat2;
        }
        if(srca!=0){
            src1=srca;
        }
        if(srcb!=0){
            src1=srcb;
        }
        if(srcc!=0){
            src1=srcc;
        }
        if(srcd!=0){
            src1=srcd;
        }
        if(srce!=0){
            src1=srce;
        }
        if(srcf!=0){
            src1=srcf;
        }
        if(srcg!=0){
            src1=srcg;
        }
        if(srch!=0){
            src1=srch;
        }
//        t.setText("hi"+src1+src2);

       call();

        init();
        dijkastra();
        display(src2);















        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }
    public void init()
    {
        for(int i=0;i<vertex;i++)
        {
            visited[i]=false;
            dist[i]=999;
            parent[i]=i;
        }
        dist[src1]=0;
    }

    public int getnearest()
    {
        int nearest=0,min=999;
        for(int i=0;i<vertex;i++)
        {
            if(!visited[i]&&dist[i]<min)
            {
                min=dist[i];
                nearest=i;
            }
        }
        return nearest;
    }

    public void dijkastra()
    {
        for(int i=0;i<vertex;i++)
        {
            int nearest = getnearest();
            visited[nearest]=true;
            for(int j=0;j<vertex;j++)
            {
                if(cost[nearest][j]!=999&&dist[j]>cost[nearest][j]+dist[nearest])
                {
                    dist[j]=cost[nearest][j]+dist[nearest];
                    parent[j]=nearest;
                }
            }
        }
    }
    public void display(int d){
        if(d==0){
            t.setText(" Agriculture Block");
            int p0=parent[0];
            for(int i=0;i<vertex;i++){
                while(p0!=src1){
                    t.append(" <--- ");
                    if(p0==0){
                        t.append(" Agriculture  Block");
                    }
                    if(p0==1){
                        t.append(" A Block");
                    }if(p0==2){
                        t.append(" AI & Future Centre Block");
                    }if(p0==3){
                        t.append(" C Block");
                    }if(p0==4){
                        t.append(" D & E Block");
                    }if(p0==5){
                        t.append(" OAT");
                    }if(p0==6){
                        t.append(" G & H Block");
                    }if(p0==7){
                        t.append(" Library ");
                    }
                    p0=parent[p0];

                }
            }
            t2.append("Total Distance "+dist[0]);

        }

        if(d==1){
            t.setText(" A Block");
            int p1=parent[1];
            for(int i=0;i<vertex;i++){
                while(p1!=src1){
                    t.append(" <--- ");
                    if(p1==0){
                        t.append(" Agriculture  Block");
                    }
                    if(p1==1){
                        t.append(" A Block");
                    }if(p1==2){
                        t.append(" AI & Future Centre Block");
                    }if(p1==3){
                        t.append(" C Block");
                    }if(p1==4){
                        t.append(" D & E Block");
                    }if(p1==5){
                        t.append(" OAT");
                    }if(p1==6){
                        t.append(" G & H Block");
                    }if(p1==7){
                        t.append(" Library ");
                    }
                    p1=parent[p1];

                }
            }
            t2.append("Total Distance "+dist[1]);

        }

        if(d==2){
            t.setText(" AI & Future Centre Block");
            int p2=parent[2];
            for(int i=0;i<vertex;i++){
                while(p2!=src1){
                    t.append(" <--- ");
                    if(p2==0){
                        t.append(" Agriculture  Block");
                    }
                    if(p2==1){
                        t.append(" A Block");
                    }if(p2==2){
                        t.append(" AI & Future Centre Block");
                    }if(p2==3){
                        t.append(" C Block");
                    }if(p2==4){
                        t.append(" D & E Block");
                    }if(p2==5){
                        t.append(" OAT");
                    }if(p2==6){
                        t.append(" G & H Block");
                    }if(p2==7){
                        t.append(" Library ");
                    }
                    p2=parent[p2];

                }
            }
            t2.append("Total Distance "+dist[2]);

        }

        if(d==3){
            t.setText(" C Block");
            int p3=parent[3];
            for(int i=0;i<vertex;i++){
                while(p3!=src1){
                    t.append(" <--- ");
                    if(p3==0){
                        t.append(" Agriculture  Block");
                    }
                    if(p3==1){
                        t.append(" A Block");
                    }if(p3==2){
                        t.append(" AI & Future Centre Block");
                    }if(p3==3){
                        t.append(" C Block");
                    }if(p3==4){
                        t.append(" D & E Block");
                    }if(p3==5){
                        t.append(" OAT");
                    }if(p3==6){
                        t.append(" G & H Block");
                    }if(p3==7){
                        t.append(" Library ");
                    }
                    p3=parent[p3];

                }
            }
            t2.append("Total Distance "+dist[3]);

        }

        if(d==4){
            t.setText(" D & E Block");
            int p4=parent[4];
            for(int i=0;i<vertex;i++){
                while(p4!=src1){
                    t.append(" <--- ");
                    if(p4==0){
                        t.append(" Agriculture  Block");
                    }
                    if(p4==1){
                        t.append(" A Block");
                    }if(p4==2){
                        t.append(" AI & Future Centre Block");
                    }if(p4==3){
                        t.append(" C Block");
                    }if(p4==4){
                        t.append(" D & E Block");
                    }if(p4==5){
                        t.append(" OAT");
                    }if(p4==6){
                        t.append(" G & H Block");
                    }if(p4==7){
                        t.append(" Library ");
                    }
                    p4=parent[p4];

                }
            }
            t2.append("Total Distance "+dist[4]);

        }

        if(d==5){
            t.setText(" OAT");
            int p5=parent[5];
            for(int i=0;i<vertex;i++){
                while(p5!=src1){
                    t.append(" <--- ");
                    if(p5==0){
                        t.append(" Agriculture  Block");
                    }
                    if(p5==1){
                        t.append(" A Block");
                    }if(p5==2){
                        t.append(" AI & Future Centre Block");
                    }if(p5==3){
                        t.append(" C Block");
                    }if(p5==4){
                        t.append(" D & E Block");
                    }if(p5==5){
                        t.append(" OAT");
                    }if(p5==6){
                        t.append(" G & H Block");
                    }if(p5==7){
                        t.append(" Library ");
                    }
                    p5=parent[p5];

                }
            }
            t2.append("Total Distance "+dist[5]);

        }

        if(d==6){
            t.setText(" G & H Block");
            int p6=parent[6];
            for(int i=0;i<vertex;i++){
                while(p6!=src1){
                    t.append(" <--- ");
                    if(p6==0){
                        t.append(" Agriculture  Block");
                    }
                    if(p6==1){
                        t.append(" A Block");
                    }if(p6==2){
                        t.append(" AI & Future Centre Block");
                    }if(p6==3){
                        t.append(" C Block");
                    }if(p6==4){
                        t.append(" D & E Block");
                    }if(p6==5){
                        t.append(" OAT");
                    }if(p6==6){
                        t.append(" G & H Block");
                    }if(p6==7){
                        t.append(" Library ");
                    }
                    p6=parent[p6];

                }
            }
            t2.append("Total Distance "+dist[6]);

        }

        if(d==7){
            t.setText(" Library");
            int p7=parent[7];
            for(int i=0;i<vertex;i++){
                while(p7!=src1){
                    t.append(" <--- ");
                    if(p7==0){
                        t.append(" Agriculture  Block");
                    }
                    if(p7==1){
                        t.append(" A Block");
                    }if(p7==2){
                        t.append(" AI & Future Centre Block");
                    }if(p7==3){
                        t.append(" C Block");
                    }if(p7==4){
                        t.append(" D & E Block");
                    }if(p7==5){
                        t.append(" OAT");
                    }if(p7==6){
                        t.append(" G & H Block");
                    }if(p7==7){
                        t.append(" Library ");
                    }
                    p7=parent[p7];

                }
            }
            t2.append("Total Distance "+dist[7]);

        }

    }
    public void call() {
        if (var12 == 1) {


            int r = 0;
            Intent q = getIntent();
            int a = q.getIntExtra("val_1", r);
            int b = q.getIntExtra("val_2", r);
            f = cost[a][b];
            cost[a][b] = 999;
            var12=0;
            Intent t = new Intent(this, MainActivity.class);
            startActivity(t);
        }
    }










}