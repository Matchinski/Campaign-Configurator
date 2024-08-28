const chartData = {
    name: "root",
    children: [
        {
            name: "Product",
            children: [
                {
                    name: "NeXt Performance",
                    children: [
                        { name: "Display Banner", value: 1 },
                        { name: "Display Interstitial", value: 1 },
                        { name: "Rich Media", value: 1 },
                        { name: "Video", value: 1 },
                        { name: "Audio", value: 1 },
                        { name: "CTV", value: 1 },
                        { name: "Digital OOH", value: 1 }
                    ]
                },
                {
                    name: "Social",
                    children: [
                        { name: "Facebook", value: 1 },
                        { name: "Instagram", value: 1 }
                    ]
                },
                {
                    name: "Interactive video",
                    children: [
                        { name: "IDV", value: 1 },
                        { name: "IDVx", value: 1 },
                        { name: "TrueX Engagement", value: 1 },
                        { name: "XtendedView", value: 1 }
                    ]
                },
                {
                    name: "Out of Home (OOH)",
                    children: [
                        { name: "InStadium", value: 1 },
                        { name: "Video", value: 1 },
                        { name: "Audio", value: 1 },
                        { name: "Display", value: 1 }
                    ]
                }
            ]
        },
        {
            name: "Supply",
            children: [
                {
                    name: "Device",
                    children: [
                        { name: "Desktop", value: 1 },
                        { name: "Mobile web", value: 1 },
                        { name: "Mobile in-app", value: 1 },
                        { name: "CTV", value: 1 },
                        { name: "Tablet", value: 1 },
                        { name: "Console", value: 1 }
                    ]
                },
                {
                    name: "Supply type",
                    children: [
                        { name: "Opt-in", value: 1 },
                        { name: "Programmatic", value: 1 }
                    ]
                },
                {
                    name: "Placement type",
                    children: [
                        { name: "FEPs", value: 1 },
                        { name: "Gaming", value: 1 },
                        { name: "News", value: 1 },
                        { name: "Lifestyle", value: 1 }
                    ]
                }
            ]
        },
        {
            name: "Objectives",
            children: [
                {
                    name: "Reach",
                    children: [
                        { name: "Unique views", value: 1 },
                        { name: "Impressions", value: 1 },
                        { name: "Frequency", value: 1 }
                    ]
                },
                {
                    name: "Engagement",
                    children: [
                        { name: "CTR", value: 1 },
                        { name: "VCR", value: 1 },
                        { name: "Attention", value: 1 },
                        { name: "Brand Lift", value: 1 },
                        { name: "Interaction Rate", value: 1 }
                    ]
                },
                {
                    name: "Efficiency",
                    children: [
                        { name: "CPC", value: 1 },
                        { name: "CPM", value: 1 },
                        { name: "ROAS", value: 1 },
                        { name: "CPA", value: 1 },
                        { name: "CPCV", value: 1 },
                        { name: "CPSV", value: 1 }
                    ]
                },
                {
                    name: "Customer Acquisition",
                    children: [
                        { name: "Conversions", value: 1 },
                        { name: "Sales", value: 1 },
                        { name: "Location visits", value: 1 },
                        { name: "Website visits", value: 1 },
                        { name: "App downloads", value: 1 }
                    ]
                }
            ]
        },
        {
            name: "Data",
            children: [
                {
                    name: "1P Measurement",
                    children: [
                        { name: "Arrival", value: 1 },
                        { name: "ELAR", value: 1 },
                        { name: "OOH Exposure", value: 1 },
                        { name: "UpLift", value: 1 }
                    ]
                },
                {
                    name: "1P Reporting",
                    children: [
                        { name: "Ad relevance", value: 1 },
                        { name: "Brand lift", value: 1 },
                        { name: "Engagement metrics", value: 1 },
                        { name: "Audience reporting", value: 1 },
                        { name: "Device reporting", value: 1 }
                    ]
                },
                {
                    name: "3P Measurement",
                    children: [
                        { name: "Sales lift", value: 1 },
                        { name: "Attention", value: 1 },
                        { name: "Brand lift", value: 1 }
                    ]
                },
                {
                    name: "3P Reporting",
                    children: [
                        { name: "Viewability", value: 1 },
                        { name: "Fraud", value: 1 }
                    ]
                },
                {
                    name: "API Integrations",
                    children: [
                        { name: "Maps", value: 1 },
                        { name: "Weather", value: 1 },
                        { name: "Ticketing", value: 1 },
                        { name: "Real-time feed URL", value: 1 }
                    ]
                }
            ]
        },
        {
            name: "Targeting",
            children: [
                {
                    name: "Audiences",
                    children: [
                        { name: "0P Segment Survey", value: 1 },
                        { name: "0P Pre-Qualified", value: 1 },
                        { name: "1P Geo/Demo", value: 1 },
                        { name: "1P Location", value: 1 },
                        { name: "3P Geo/Demo", value: 1 },
                        { name: "3P Interest-based", value: 1 },
                        { name: "3P Behavioral", value: 1 },
                        { name: "Contextual", value: 1 },
                        { name: "Client Segments", value: 1 }
                    ]
                },
                {
                    name: "Retargeting",
                    children: [
                        { name: "Websites", value: 1 },
                        { name: "Apps", value: 1 },
                        { name: "Cross-channel", value: 1 },
                        { name: "Sequential", value: 1 },
                        { name: "Cross-product", value: 1 }
                    ]
                },
                {
                    name: "Modeling",
                    children: [
                        { name: "Lookalike", value: 1 },
                        { name: "Predictive", value: 1 }
                    ]
                },
                {
                    name: "Identity Resolution",
                    children: [
                        { name: "XGraph", value: 1 }
                    ]
                },
                {
                    name: "Other",
                    children: [
                        { name: "Proximity via FSQ", value: 1 },
                        { name: "Device type", value: 1 },
                        { name: "Dayparting", value: 1 },
                        { name: "Recency", value: 1 },
                        { name: "Frequency capping", value: 1 }
                    ]
                }
            ]
        },
        {
            name: "Creative",
            children: [
                {
                    name: "Blueprint",
                    children: [
                        { name: "Foundation", value: 1 },
                        { name: "Foundation Carousel", value: 1 },
                        { name: "Guided Story", value: 1 },
                        { name: "Content Collection", value: 1 },
                        { name: "Poll", value: 1 },
                        { name: "Quiz", value: 1 },
                        { name: "Multiple Video", value: 1 },
                        { name: "Hotspot", value: 1 }
                    ]
                },
                {
                    name: "Custom",
                    children: [
                        { name: "Audience Segmentation", value: 1 },
                        { name: "Branching", value: 1 },
                        { name: "Choose Your Own Adventure", value: 1 },
                        { name: "Game", value: 1 },
                        { name: "Quiz", value: 1 },
                        { name: "2-Screen CTV Experience", value: 1 }
                    ]
                },
                {
                    name: "Display",
                    children: [
                        { name: "Interstitial", value: 1 },
                        { name: "Inline Video", value: 1 },
                        { name: "Animated Banner", value: 1 },
                        { name: "Filmstrip", value: 1 },
                        { name: "Tiles", value: 1 },
                        { name: "Slider", value: 1 },
                        { name: "Parallax", value: 1 },
                        { name: "Scratcher", value: 1 },
                        { name: "Add To Contacts", value: 1 },
                        { name: "Fan Cam Frames", value: 1 },
                        { name: "Public Announcement", value: 1 },
                        { name: "Display Ads", value: 1 },
                        { name: "Reward Activations", value: 1 },
                        { name: "Music Challenges", value: 1 },
                        { name: "On Court Projections", value: 1 },
                        { name: "Product Samples", value: 1 },
                        { name: "AR Creative", value: 1 },
                        { name: "Virtual Reality", value: 1 }
                    ]
                },
                {
                    name: "Enhancements",
                    children: [
                        { name: "ShopX", value: 1 },
                        { name: "Weather-Reactive", value: 1 },
                        { name: "Time-Reactive", value: 1 },
                        { name: "Voice-Reactive", value: 1 },
                        { name: "Location-Reactive", value: 1 },
                        { name: "Countdown", value: 1 },
                        { name: "Add To Wallet", value: 1 },
                        { name: "360 Video", value: 1 },
                        { name: "AR Creative", value: 1 },
                        { name: "Tap To Map", value: 1 },
                        { name: "Language Toggle", value: 1 },
                        { name: "API Integration", value: 1 }
                    ]
                }
            ]
        }
    ]
};

export { chartData };
