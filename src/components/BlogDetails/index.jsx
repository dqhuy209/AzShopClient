'use client'
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import bannerService from '@/services/bannerService'

const BlogDetails = () => {
  const [policies, setPolicies] = useState([])
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await bannerService.getPolicy()
        setPolicies(response.data.data.content)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchPolicies().then()
  }, [])
  return (
    <>
      <Breadcrumb
        title={'CHÍNH SÁCH VÀ ĐIỀU KHOẢN'}
        pages={['CHÍNH SÁCH VÀ ĐIỀU KHOẢN']}
      />
      <section className="overflow-hidden py-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {policies.map((policy, index) => (
            <div key={index}>
              <h2 className="font-medium text-dark text-xl lg:text-2xl xl:text-custom-4xl mb-4">
                {policy.title}
              </h2>

              <p
                className="mb-6 break-words"
                dangerouslySetInnerHTML={{ __html: policy.content }}
              >
                {}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default BlogDetails
