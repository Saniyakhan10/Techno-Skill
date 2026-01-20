// Compare page specific JavaScript

document.addEventListener('DOMContentLoaded', function () {
    loadComparisonTable();
});

function loadComparisonTable() {
    const container = document.getElementById('comparison-container');
    const compareCourses = getCompareCourses();

    if (compareCourses.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 100px 20px;">
                <div style="font-size: 80px; color: #e2e8f0; margin-bottom: 25px;">
                    <i class="fas fa-layer-group"></i>
                </div>
                <h3 style="font-size: 1.8rem; font-weight: 800; color: #1e293b; margin-bottom: 15px;">No courses to compare</h3>
                <p style="color: #64748b; margin-bottom: 30px; font-size: 1.1rem;">Add courses from our professional curriculum to compare them side-by-side.</p>
                <a href="courses.html" class="btn btn-primary" style="padding: 12px 35px; border-radius: 50px;">
                    <i class="fas fa-search"></i> Browse Courses
                </a>
            </div>
        `;
        return;
    }

    // Create comparison table
    let tableHTML = `
        <div class="comparison-card" style="background: white; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #f1f5f9;">
            <div class="table-responsive" style="overflow-x: auto;">
                <table class="comparison-table-premium" style="width: 100%; border-collapse: collapse; min-width: 800px;">
                    <thead>
                        <tr>
                            <th style="width: 250px; background: #f8fafc; padding: 30px; text-align: left; border-bottom: 2px solid #e2e8f0;">
                                <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">Course Comparison</div>
                                <div style="font-size: 0.9rem; color: #64748b; font-weight: normal; margin-top: 5px;">${compareCourses.length} of 3 Selected</div>
                            </th>
                            ${compareCourses.map(course => `
                                <th style="padding: 30px; text-align: center; border-bottom: 2px solid #e2e8f0; position: relative;">
                                    <button onclick="removeFromCompareList(${course.id})" style="position: absolute; top: 15px; right: 15px; background: #fee2e2; color: #ef4444; border: none; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">
                                        <i class="fas fa-times"></i>
                                    </button>
                                    <img src="${course.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 8px 15px rgba(0,0,0,0.1);">
                                    <h4 style="font-size: 1.1rem; color: #1e293b; margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 3em;">${course.title}</h4>
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Price Row -->
                        <tr class="row-highlight">
                            <td class="feature-label">Price</td>
                            ${compareCourses.map(course => `
                                <td class="feature-value" style="text-align: center;">
                                    <div class="price-pill" style="display: inline-block; padding: 8px 15px; background: #eff6ff; color: #3b82f6; border-radius: 50px; font-weight: 800; font-size: 1.3rem;">
                                        ₹${course.price.toLocaleString('en-IN')}
                                    </div>
                                </td>
                            `).join('')}
                        </tr>
                        <!-- Level Row -->
                        <tr>
                            <td class="feature-label">Expertise Level</td>
                            ${compareCourses.map(course => `
                                <td class="feature-value" style="text-align: center;">
                                    <span class="level-badge-premium level-${course.level.toLowerCase()}">
                                        <i class="fas fa-signal"></i> ${course.level}
                                    </span>
                                </td>
                            `).join('')}
                        </tr>
                        <!-- Rating Row -->
                        <tr>
                            <td class="feature-label">Average Rating</td>
                            ${compareCourses.map(course => `
                                <td class="feature-value" style="text-align: center;">
                                    <div style="color: #f59e0b; font-weight: 800; font-size: 1.1rem;">
                                        <i class="fas fa-star"></i> ${course.rating.toFixed(1)}
                                    </div>
                                    <div style="font-size: 0.8rem; color: #94a3b8;">User Reviews</div>
                                </td>
                            `).join('')}
                        </tr>
                        <!-- Students Row -->
                        <tr>
                            <td class="feature-label">Active Enrolled</td>
                            ${compareCourses.map(course => `
                                <td class="feature-value" style="text-align: center; font-weight: 600; color: #334155;">
                                    ${course.students.toLocaleString()} Learners
                                </td>
                            `).join('')}
                        </tr>
                        <!-- Duration Row -->
                        <tr>
                            <td class="feature-label">Total Duration</td>
                            ${compareCourses.map(course => `
                                <td class="feature-value" style="text-align: center; color: #475569;">
                                    <i class="far fa-clock"></i> ${course.duration}
                                </td>
                            `).join('')}
                        </tr>
                        <!-- Certificate Row -->
                        <tr>
                            <td class="feature-label">Official Certificate</td>
                            ${compareCourses.map(course => `
                                <td class="feature-value" style="text-align: center;">
                                    ${course.certificate ?
            '<span style="color: #10b981; font-weight: 600;"><i class="fas fa-check-circle"></i> Included</span>' :
            '<span style="color: #94a3b8;"><i class="fas fa-times-circle"></i> Not Available</span>'
        }
                                </td>
                            `).join('')}
                        </tr>
                         <!-- Lectures Row -->
                        <tr>
                            <td class="feature-label">Curriculum Content</td>
                            ${compareCourses.map(course => `
                                <td class="feature-value" style="text-align: center; color: #475569;">
                                    ${course.lectures || 'N/A'} Video Lessons
                                </td>
                            `).join('')}
                        </tr>
                        <!-- Instructor Row -->
                        <tr>
                            <td class="feature-label">Course Mentor</td>
                            ${compareCourses.map(course => `
                                <td class="feature-value" style="text-align: center;">
                                    <div style="font-weight: 700; color: #1e293b;">${course.instructor}</div>
                                    <div style="font-size: 0.75rem; color: #64748b;">Verified Expert</div>
                                </td>
                            `).join('')}
                        </tr>
                        <!-- Actions Row -->
                        <tr style="background: #f8fafc;">
                            <td class="feature-label">Decision</td>
                            ${compareCourses.map(course => `
                                <td class="feature-value" style="text-align: center; padding: 40px 20px;">
                                    <button class="btn btn-primary" onclick="buyCourse(${course.id})" style="width: 100%; margin-bottom: 12px; border-radius: 12px; height: 50px;">
                                        Add to Cart & Buy
                                    </button>
                                    <button class="btn btn-outline" onclick="toggleWishlist(${course.id})" style="width: 100%; border-radius: 12px; height: 50px; background: white;">
                                        <i class="${isInWishlist(course.id) ? 'fas' : 'far'} fa-heart"></i> ${isInWishlist(course.id) ? 'Already Saved' : 'Save to Wishlist'}
                                    </button>
                                </td>
                            `).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <style>
            .feature-label {
                background: #f8fafc;
                padding: 20px 30px;
                font-weight: 700;
                color: #475569;
                border-bottom: 1px solid #e2e8f0;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-size: 0.8rem;
            }
            .feature-value {
                padding: 20px;
                border-bottom: 1px solid #f1f5f9;
                font-size: 0.95rem;
            }
            .row-highlight {
                background: #fafbff;
            }
            .level-badge-premium {
                padding: 6px 14px;
                border-radius: 30px;
                font-size: 0.75rem;
                font-weight: 700;
                display: inline-block;
                text-transform: uppercase;
            }
            .level-beginner { background: #dcfce7; color: #166534; }
            .level-intermediate { background: #fef9c3; color: #854d0e; }
            .level-advanced { background: #fee2e2; color: #991b1b; }
            
            .comparison-table-premium tr:hover td {
                background-color: #f1f5f9;
            }
            .comparison-table-premium tr:hover .feature-label {
                background-color: #f1f5f9;
            }
        </style>
    `;

    container.innerHTML = tableHTML;
}