Shader "Custom/AlignWithCamera"
{
    Properties
    {
        _MainTex("Albedo (RGB)", 2D) = "white" {}
        _Glossiness("Smoothness", Range(0,1)) = 0.5
        _Metallic("Metallic", Range(0,1)) = 0.0
        _BumpMap("Normal Map", 2D) = "bump" {}
    }
        SubShader
    {
        Tags { "RenderType" = "Opaque" }
        LOD 200

        CGPROGRAM
        #pragma surface surf Standard fullforwardshadows

        struct Input
        {
            float2 uv_MainTex;
            float2 uv_BumpMap;
        };

        sampler2D _MainTex;
        sampler2D _BumpMap;

        half _Glossiness;
        half _Metallic;

        void surf(Input IN, inout SurfaceOutputStandard o)
        {
            // Calculate world space position of the vertex
            float3 worldPos = mul(unity_ObjectToWorld, float4(IN.uv_MainTex, 0, 1));

            // Calculate the direction from the camera to the vertex
            float3 viewDirection = normalize(_WorldSpaceCameraPos - worldPos);

            // Calculate the aligned UV coordinates
            float2 alignedUV = float2(viewDirection.x, viewDirection.y) * 0.5 + 0.5;

            // Sample the textures
            fixed4 albedo = tex2D(_MainTex, alignedUV);
            fixed3 normal = UnpackNormal(tex2D(_BumpMap, IN.uv_BumpMap));

            // Output properties
            o.Albedo = albedo.rgb;
            o.Metallic = _Metallic;
            o.Smoothness = _Glossiness;
            o.Normal = normal;
        }
        ENDCG
    }
        FallBack "Diffuse"
}
