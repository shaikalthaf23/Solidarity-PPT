import plotly.graph_objects as go
import plotly.io as pio

# Data from the project stats
languages = ['HTML5', 'CSS3', 'JavaScript']
lines_of_code = [26563, 38995, 28850]

# Create bar chart with brand colors
fig = go.Figure(data=[
    go.Bar(
        x=languages,
        y=lines_of_code,
        marker_color=['#1FB8CD', '#DB4545', '#2E8B57'],
        text=[f'{val/1000:.1f}k' for val in lines_of_code],
        textposition='outside',
        textfont=dict(size=16, color='black'),
        name='Lines of Code',
        cliponaxis=False
    )
])

# Update layout
fig.update_layout(
    title='SOLIDARITY: Code Distribution',
    xaxis_title='Technology',
    yaxis_title='Lines of Code',
    showlegend=False,
    plot_bgcolor='white'
)

# Format y-axis to show values in thousands
fig.update_yaxes(
    tickformat='.0f',
    title_font_size=14
)

fig.update_xaxes(
    title_font_size=14
)

# Add total at top
fig.add_annotation(
    x=1,
    y=max(lines_of_code) * 1.15,
    text=f"Total: 94.4k Lines",
    showarrow=False,
    font=dict(size=18, color='black'),
    bgcolor='rgba(255,255,255,0.8)',
    bordercolor='gray',
    borderwidth=1
)

# Save the chart
fig.write_image('solidarity_code_stats.png')